import {
  Body,
  Controller,
  Post,
  HttpCode,
  Request,
  Ip,
  Req,
  Headers,
  Get,
  UseGuards,
  ValidationPipe,
  HttpStatus,
  Query,
  Param,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

import {
  TaskPublishRequest,
  TaskStatusUpdateRequest,
  OwnerTaskListRequest,
  ExecutorTaskListRequest,
  TaskListResponse,
  NormalResponse,
} from './dto';
import { AppLogger } from '../logger/logger';
import { TaskService } from './task.service';
import { BlockChainService } from './blockchain.service';
import { ContractDto } from './dto/req/contract.dto';
import { ConfigService } from 'src/config/config.service';

@ApiTags('Task')
@Controller('task')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly chainService: BlockChainService,
    private configService: ConfigService
    ) {}

  @Post('publish')
  @ApiOperation({
    summary: 'publish a task',
    description: 'Publish a new task to specified user',
  })
  @ApiBody({
    description: ``,
    type: TaskPublishRequest,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Publish a task to specified user successfully',
    type: NormalResponse,
  })
  public async publish(
    @Body(ValidationPipe) body: TaskPublishRequest,
  ): Promise<string> {
    return this.taskService.publish(body);
  }

  @Post('updateStatus')
  @ApiOperation({
    summary: 'update the status of a task',
    description: 'Update the status of a specified task',
  })
  @ApiBody({
    description: ``,
    type: TaskStatusUpdateRequest,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Update the status of a specified task successfully',
    type: NormalResponse,
  })
  public async updateStatus(
    @Body(ValidationPipe) body: TaskStatusUpdateRequest,
  ): Promise<string> {
    return this.taskService.updateTaskStatus(body);
  }

  @Post('executor/list')
  @ApiOperation({
    summary: 'list tasks of owner',
    description: 'List tasks for specified user as owner',
  })
  @ApiBody({
    description: ``,
    type: ExecutorTaskListRequest,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'List tasks for specified user as owner successfully',
    type: TaskListResponse,
  })
  public async listExecutorTasks(
    @Body(ValidationPipe) body: TaskPublishRequest,
  ): Promise<TaskListResponse> {
    return this.taskService.listExecutorTasks(body);
  }

  @Post('owner/list')
  @ApiOperation({
    summary: 'list tasks of owner',
    description: 'List tasks for specified user as owner',
  })
  @ApiBody({
    description: ``,
    type: OwnerTaskListRequest,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'List tasks for specified user as owner successfully',
    type: TaskListResponse,
  })
  public async listOwnerTasks(
    @Body(ValidationPipe) body: TaskPublishRequest,
  ): Promise<TaskListResponse> {
    return this.taskService.listOwnerTasks(body);
  }

  @Get('hello')
  public async hello() {
    try {
      const contractId = this.chainService.randomName();
      const callerId = 'uwdmdifvpkmm';
      const authorId = 'nmpykawmqirl';
      let res = '';

      // create 
      const contractDto: ContractDto = {
        id: contractId,
        callerId: callerId, //task001 uwdmdifvpkmm
        authorId: authorId, //task002 buy3wf5shchq
        title: 'big news',
        content: 'big news content',
        hash: '000000000011111',
        amount: '10'
      }

      res = await this.chainService.createContract(contractDto);
      console.log(`contractId = ${contractId} `);
      console.log(res);

      //  cancelContract
      // res = await this.chainService.cancelContract('uokwssfnjbai', callerId);
      // console.log(cancelContract');
      // console.log(res);

      //  acceptContract
      res = await this.chainService.acceptContract(contractId, authorId);
      console.log(`acceptContract: ${contractId}`);
      console.log(res);

      // // approve
      res = await this.chainService.approve(contractId, callerId);
      console.log(`approve: ${contractId}`);
      console.log(res);
      
      // burn 
      // res = await this.chainService.burn(callerId, '1');
      // console.log(`burn:`);
      // console.log(res);

       //  test pay 
       res = await this.chainService.pay2(contractId, callerId, authorId, '2.0');

       return '';
       
      // pay 
      const contractName = this.configService.getLocalConfig().get('dactokencontract');
      const amount  = 1;
      // 90%
      res = await this.chainService.pay(contractId, callerId, (amount*0.9).toString());

      // 90%
      // res = await this.chainService.pay(contractId, authorId, (amount*0.9).toString());

      console.log(`pay:`);
      console.log(res);

      return 'hello'
    } catch (e) {
      console.log(e);
    }
  }
}
