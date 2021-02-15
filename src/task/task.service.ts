import { forwardRef, Inject, Injectable, HttpStatus } from '@nestjs/common';
import * as util from 'util';
import * as moment from 'moment';
import * as config from 'config';

import { AppLogger } from '../logger/logger';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiException, ApiMsgCode } from '../shared';
import { RandomName } from '../shared';
import {
  ContractDto,
  TaskPublishRequest,
  TaskStatusUpdateRequest,
  OwnerTaskListRequest,
  ExecutorTaskListRequest,
  TaskListRespData,
  TaskListResponse,
  NormalResponse,
} from './dto';
import { Profile } from '../account/entities';
import { Posts } from '../post/entities';
import { Task } from './entities';
import { CryptoUtil } from '../utils/crypto.util';
import { toChainAssetPaddedQuantity } from '../utils/generalHelpers';

import { BlockChainService } from './blockchain.service';
@Injectable()
export class TaskService {
  constructor(
    private logger: AppLogger,
    @InjectRepository(Profile) private readonly profileRepo: Repository<Profile>,
    @Inject(CryptoUtil) private readonly cryptoUtil: CryptoUtil,
    @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
    @InjectRepository(Posts) private readonly postRepo: Repository<Posts>,
    private blockchainService: BlockChainService,
  ) {}

  async publish(body: TaskPublishRequest): Promise<string> {
    this.logger.debug(`publish body: ${JSON.stringify(body)}`);
    try {
      const contractId = RandomName();
      const contentHash = await this.cryptoUtil.sha256(
        `${body.title}###${body.body}`,
      );

      const tokenPrecision = config.get<number>(
        'stableTokenList.usdToken.precision',
      );
      const contractBody: ContractDto = {
        id: contractId,
        callerId: body.name,
        authorId: body.executorName,
        title: body.title,
        content: body.body,
        hash: contentHash,
        amount: toChainAssetPaddedQuantity(`${body.payment}`, tokenPrecision),
      };
      await this.blockchainService.createContract(contractBody);

      const newTask: Task = this.taskRepo.create({
        title: body.title,
        body: body.body,
        status: body.status || 'sentToExecutor',
        neededLikes: body.neededLikes,
        payment: body.payment,
        name: body.name,
        executorName: body.executorName,
        dueAt: body.dueAt,
        publishAt: body.publishAt,
        contractId: contractId,
        contentHash: contentHash,
        ownerInfo: body.ownerInfo,
        executorInfo: body.executorInfo,
      });

      this.logger.debug(`task save to database:${newTask}`);
      const res = await this.taskRepo.save(newTask);

      return res.taskId;
    } catch (e) {
      console.error('publish', e);
      throw new ApiException(
        'task publish failed',
        ApiMsgCode.TASK_PUBLISH_FAILED,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * @param body
   * body.status
   * 稿约发出：sentToExecutor
   * 稿约取消：canceled
   * 被约稿人接受稿约：executorAccepted
   * 文章发往约稿人审核：submittedToOwner
   * 文章退回被约稿人：returnedToExecutor
   * 文章发出：published
   * 点赞目标完成50%：halfCompleted
   * 点赞目标完成100%：completed
   */
  async updateTaskStatus(body: TaskStatusUpdateRequest): Promise<string> {
    this.logger.debug(`publish body: ${JSON.stringify(body)}`);
    try {
      const task = await this.taskRepo.findOne({ taskId: body.taskId });
      const executor = await this.profileRepo.findOne({ name: task.executorName });
      if (body.status === 'canceled') {
        console.log('doing cancelTask');
        await this.cancelTask(task);
        console.log('done cancelTask');
      } else if (body.status === 'executorAccepted') {
        console.log('doing acceptTask');
        await this.acceptTask(task);
        console.log('done acceptTask');

        console.log('doing postRepo.save');
        const post = this.postRepo.create({
          name: task.name,
          title: 'title',
          content: 'body',
          mode: 'draft',
          status: 'draft',
          tag: 'task',
          authorName: executor.name,
          authorNickName: executor.nickName,
          authorAvatar: executor.avatar,
        });
        const savedPost = await this.postRepo.save(post);
        console.log('done postRepo.save');

        console.log('doing taskRepo.update');
        await this.taskRepo.update(
          {
            taskId: body.taskId,
          },
          {
            postId: savedPost.postId,
          },
        );
        console.log('done taskRepo.update');
      } else if (body.status === 'submittedToOwner') {
        console.log('doing submitTaskToOwner');
        await this.submitTaskToOwner(task);
        console.log('done submitTaskToOwner');

        console.log('doing postRepo.update');
        await this.postRepo.update({
          name: task.name,
          postId: task.postId,
          status: 'draft',
        }, {
          status: 'submitted'
        });
        console.log('done postRepo.update');
      } else if (body.status === 'returnedToExecutor') {
        console.log('doing returnTaskToExecutor');
        await this.returnTaskToExecutor(task);
        console.log('done returnTaskToExecutor');

        console.log('doing postRepo.update');
        await this.postRepo.update({
          name: task.name,
          postId: task.postId,
          status: 'submitted',
        }, {
          status: 'draft'
        });
        console.log('done postRepo.update');
      } else if (body.status === 'published') {
        console.log('doing publishTaskAssignment');
        await this.publishTaskAssignment(task);
        console.log('done publishTaskAssignment');

        console.log('doing postRepo.update');
        await this.postRepo.update({
          name: task.name,
          postId: task.postId,
          status: 'submitted',
        }, {
          status: 'published'
        });
        console.log('done postRepo.update');
      } else if (body.status === 'halfCompleted') {
        console.log('doing halfCompleteTask');
        await this.halfCompleteTask(task);
        console.log('done halfCompleteTask');
      } else if (body.status === 'completed') {
        console.log('doing completeTask');
        await this.completeTask(task);
        console.log('done completeTask');
      }

      console.log('doing taskRepo.update');
      await this.taskRepo.update(
        {
          taskId: body.taskId,
        },
        {
          status: body.status,
        },
      );
      console.log('done taskRepo.update');

      return 'success';
    } catch (e) {
      throw new ApiException(
        'task update failed',
        ApiMsgCode.TASK_UPDATE_FAILED,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async cancelTask(task: Task): Promise<string> {
    console.log('doing cancelTask#blockchainService.cancelContract');
    const result = await this.blockchainService.cancelContract(
      task.contractId,
      task.name,
    );
    console.log('done cancelTask#blockchainService.cancelContract');
    return result;
  }

  async acceptTask(task: Task): Promise<string> {
    console.log('doing acceptTask#blockchainService.burn owner');
    await this.blockchainService.burn(task.name, `${task.payment * 0.1}`);
    console.log('done acceptTask#blockchainService.burn owner');

    console.log('doing acceptTask#blockchainService.burn executor');
    await this.blockchainService.burn(
      task.executorName,
      `${task.payment * 0.05}`,
    );
    console.log('done acceptTask#blockchainService.burn executor');

    console.log('doing acceptTask#blockchainService.acceptContract');
    const result = await this.blockchainService.acceptContract(
      task.contractId,
      task.executorName,
    );
    console.log('done acceptTask#blockchainService.acceptContract');
    return result;
  }

  async submitTaskToOwner(task: Task): Promise<string> {
    return 'no blockchain action needed';
  }

  async returnTaskToExecutor(task: Task): Promise<string> {
    return 'no blockchain action needed';
  }

  async publishTaskAssignment(task: Task): Promise<string> {
    console.log('doing publishTaskAssignment blockchainService.pay2');
    await this.blockchainService.pay2(
      task.contractId,
      task.name,
      task.executorName,
      `${task.payment * 0.3}`,
    );
    console.log('done publishTaskAssignment blockchainService.pay2');

    console.log('doing publishTaskAssignment blockchainService.approve');
    await this.blockchainService.approve(task.contractId, task.name);
    console.log('done publishTaskAssignment blockchainService.approve');

    return 'success';
  }

  async checkAndPay(postId: string): Promise<string> {
    const task = await this.taskRepo.findOne({
      where: {
        postId: postId,
      },
      order: {
        createdAt: -1,
      },
    });
    const post = await this.postRepo.findOne({
      where: {
        postId: postId,
      },
    });

    if (task && post && task.neededLikes) {
      const neededLikes = task.neededLikes;
      if (task.status == 'published' && post.likes > neededLikes * 0.5) {
        const { affected } = await this.taskRepo.update(
          {
            taskId: task.taskId,
            status: 'published',
          },
          {
            status: 'halfCompleted',
          },
        );
        if (affected > 0) {
          await this.halfCompleteTask(task);
        }
      } else if (task.status == 'halfCompleted' && post.likes > neededLikes) {
        const { affected } = await this.taskRepo.update(
          {
            taskId: task.taskId,
            status: 'halfCompleted',
          },
          {
            status: 'completed',
          },
        );

        if (affected > 0) {
          await this.completeTask(task);
        }
      }
    }

    return 'success';
  }

  async halfCompleteTask(task: Task): Promise<string> {
    return await this.blockchainService.pay2(
      task.contractId,
      task.name,
      task.executorName,
      `${task.payment * 0.3}`,
    );
  }

  async completeTask(task: Task): Promise<string> {
    return await this.blockchainService.pay2(
      task.contractId,
      task.name,
      task.executorName,
      `${task.payment * 0.4}`,
    );
  }

  async listExecutorTasks(
    body: ExecutorTaskListRequest,
  ): Promise<TaskListResponse> {
    this.logger.debug(`listExecutorTasks body: ${JSON.stringify(body)}`);
    const result: TaskListResponse = {
      code: 0,
      message: '',
      data: [],
    };

    const tasks = await this.taskRepo.find({
      where: {
        executorName: body.executorName,
      },
      order: {
        createdAt: -1,
      },
    });

    for (let task of tasks) {
      const respData: TaskListRespData = {
        taskId: task.taskId,
        title: task.title,
        status: task.status,
        neededLikes: task.neededLikes,
        payment: task.payment,
        name: task.name,
        executorName: task.executorName,
        createdAt: moment(task.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment(task.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
        dueAt: task.dueAt
          ? moment(task.dueAt).format('YYYY-MM-DD HH:mm:ss')
          : undefined,
        publishAt: task.publishAt
          ? moment(task.publishAt).format('YYYY-MM-DD HH:mm:ss')
          : undefined,
        ownerInfo: task.ownerInfo,
        executorInfo: task.ownerInfo,
        postId: task.postId,
      };
      result.data.push(respData);
    }

    return result;
  }

  async listOwnerTasks(body: OwnerTaskListRequest): Promise<TaskListResponse> {
    this.logger.debug(`listOwnerTasks body: ${JSON.stringify(body)}`);
    const result: TaskListResponse = {
      code: 0,
      message: '',
      data: [],
    };

    const tasks = await this.taskRepo.find({
      where: {
        name: body.name,
      },
      order: {
        createdAt: -1,
      },
    });

    for (let task of tasks) {
      const respData: TaskListRespData = {
        taskId: task.taskId,
        title: task.title,
        status: task.status,
        neededLikes: task.neededLikes,
        payment: task.payment,
        name: task.name,
        executorName: task.executorName,
        createdAt: moment(task.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment(task.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
        dueAt: task.dueAt
          ? moment(task.dueAt).format('YYYY-MM-DD HH:mm:ss')
          : undefined,
        publishAt: task.publishAt
          ? moment(task.publishAt).format('YYYY-MM-DD HH:mm:ss')
          : undefined,
        ownerInfo: task.ownerInfo,
        executorInfo: task.ownerInfo,
        postId: task.postId,
      };
      result.data.push(respData);
    }

    return result;
  }
}
