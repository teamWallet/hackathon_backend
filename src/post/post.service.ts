
import {
  PostPublishData,
  CommentPublishData,
  // NormalResponse,
  PostShowRequest,
  CommentShowRequest,
  PostListData,
  // PostShowListData,
  CommentListData,
  // CommentShowListData,
  ActiveShowRequest,
  // ListActiveResponse,
  // ActiveShowResponse,
  PostActiveData,
  LikeShowRequest,
  LikeListData,
  MyPublishRequest,
  StatusActiveData,
  UniversalResponse,
  PostActiveDataDto,
  PostStatusData,
} from './dto';
import { forwardRef, Inject, Injectable, HttpStatus } from '@nestjs/common';
import * as util from 'util';

import { AppLogger } from '../logger/logger';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiException, ApiMsgCode } from '../shared';

import { Posts, Comments, Likes, Views } from './entities';
import { AccountService } from 'src/account/account.service';
import { TaskService } from '../task/task.service';

@Injectable()
export class PostService {
  constructor(
    private logger: AppLogger,
    @InjectRepository(Posts) private readonly postsRepo: Repository<Posts>,
    @InjectRepository(Comments)
    private readonly commentsRepo: Repository<Comments>,
    @InjectRepository(Likes) private readonly likesRepo: Repository<Likes>,
    @InjectRepository(Views) private readonly viewsRepo: Repository<Views>,
    private readonly taskService: TaskService,
    private readonly accountService: AccountService
  ) {}
  async postsLike(upID: string, name: string) {
    const postsData = await this.postsRepo.findOne({ where: { postId: upID } });
    if (!postsData) {
      throw new ApiException(
        'post pushlish failed',
        ApiMsgCode.INFOMATION_PUBLISH_POSTS,
        HttpStatus.BAD_REQUEST,
      );
    }
    const likeData = {
      name: name,
      likesID: postsData.postId,
      type: 'posts',
    };
    const findData = await this.likesRepo.findOne({
      where: { name: name, likesID: likeData.likesID, type: likeData.type },
    });
    if (!findData) {
      const data = this.likesRepo.create(likeData);
      await this.likesRepo.save(data);
      await this.postsRepo.update(
        {
          postId: postsData.postId,
        },
        {
          likes: ++postsData.likes,
        },
      );

      await this.taskService.checkAndPay(postsData.postId);
    } else {
    }
  }
  async postsUnLike(upID: string, name: string) {
    const postsData = await this.postsRepo.findOne({
      where: { postId: upID },
    });
    if (!postsData) {
      throw new ApiException(
        'post pushlish failed',
        ApiMsgCode.INFOMATION_PUBLISH_POSTS,
        HttpStatus.BAD_REQUEST,
      );
    }
    const likeData = {
      name: name,
      likesID: postsData.postId,
      type: 'posts',
    };
    const findData = await this.likesRepo.findOne({
      where: { name: name, likesID: likeData.likesID, type: likeData.type },
    });
    if (findData) {
      await this.likesRepo.remove(findData);
      await this.postsRepo.update(
        {
          postId: postsData.postId,
        },
        {
          likes: --postsData.likes,
        },
      );
    }
  }
  async postsView(upID: string, name: string) {
    const postsData = await this.postsRepo.findOne({
      where: { postId: upID },
    });
    if (!postsData) {
      throw new ApiException(
        'post pushlish failed',
        ApiMsgCode.INFOMATION_PUBLISH_POSTS,
        HttpStatus.BAD_REQUEST,
      );
    }

    const viewsData = {
      name: name,
      viewsID: postsData.postId,
      type: 'posts',
    };
    const findData = await this.viewsRepo.findOne({
      where: {
        name: name,
        viewsID: viewsData.viewsID,
        type: viewsData.type,
      },
    });
    if (!findData) {
      const data = this.viewsRepo.create(viewsData);
      await this.viewsRepo.save(data);
    }
    await this.postsRepo.update(
      {
        postId: postsData.postId,
      },
      {
        views: ++postsData.views,
      },
    );
  }
  async commentLike(upID: string, name: string) {
    const postsData = await this.commentsRepo.findOne({
      where: { commetId: upID },
    });
    if (!postsData) {
      throw new ApiException(
        'post pushlish failed',
        ApiMsgCode.INFOMATION_PUBLISH_POSTS,
        HttpStatus.BAD_REQUEST,
      );
    }
    const likeData = {
      name: name,
      likesID: postsData.commentId,
      type: 'comment',
    };
    const findData = await this.likesRepo.findOne({
      where: { name: name, likesID: likeData.likesID, type: likeData.type },
    });
    if (!findData) {
      const data = this.likesRepo.create(likeData);
      await this.likesRepo.save(data);
      await this.commentsRepo.update(
        {
          commentId: postsData.commentId,
        },
        {
          likes: ++postsData.likes,
        },
      );
    }
  }
  async commentUnLike(upID: string, name: string) {
    const postsData = await this.commentsRepo.findOne({
      where: { commentId: upID },
    });
    if (!postsData) {
      throw new ApiException(
        'post pushlish failed',
        ApiMsgCode.INFOMATION_PUBLISH_POSTS,
        HttpStatus.BAD_REQUEST,
      );
    }
    const likeData = {
      name: name,
      likesID: postsData.commentId,
      type: 'comment',
    };
    const findData = await this.likesRepo.findOne({
      where: { name: name, likesID: likeData.likesID, type: likeData.type },
    });
    if (findData) {
      await this.likesRepo.remove(findData);
      await this.commentsRepo.update(
        {
          commentId: postsData.commentId,
        },
        {
          likes: --postsData.likes,
        },
      );
    }
  }
  async commentView(upID: string, name: string) {
    const postsData = await this.commentsRepo.findOne({
      where: { commentId: upID },
    });
    if (!postsData) {
      throw new ApiException(
        'post pushlish failed',
        ApiMsgCode.INFOMATION_PUBLISH_POSTS,
        HttpStatus.BAD_REQUEST,
      );
    }
    const viewsData = {
      name: name,
      viewsID: postsData.commentId,
      type: 'comment',
    };
    const findData = await this.viewsRepo.findOne({
      where: {
        name: name,
        viewsID: viewsData.viewsID,
        type: viewsData.type,
      },
    });
    if (!findData) {
      const data = this.viewsRepo.create(viewsData);
      await this.viewsRepo.save(data);
    }
    await this.commentsRepo.update(
      {
        commentId: postsData.commentId,
      },
      {
        views: ++postsData.views,
      },
    );
  }
  async getAuthor(likeInput: PostActiveData): Promise<string> {
    if (likeInput.type == 'posts') {
      if (likeInput.likeFlag) {
        const postsData = await this.postsRepo.findOne({
          where: { postId: likeInput.upID },
        });
        return postsData.name;
      }
    } else if (likeInput.type == 'comment') {
      if (likeInput.likeFlag) {
        const postsData = await this.commentsRepo.findOne({
          where: { commetId: likeInput.upID },
        });
        return postsData.name;
      }
    } else if (likeInput.type == 'task') {
    } else if (likeInput.type == 'proposal') {
    }
    return '';
  }
  async active(likeInput: PostActiveDataDto): Promise<string> {
    this.logger.debug(`information active data: ${JSON.stringify(likeInput)}`);

    this.logger.debug(`active data:${likeInput}`);
    try {
      if (likeInput.upID) {
        if (likeInput.type && likeInput.name) {
          if (likeInput.type == 'posts') {
            if (likeInput.likeFlag) {
              await this.postsLike(likeInput.upID, likeInput.name);
              const data = await this.getAuthor(likeInput);
              return data;
            } else if (likeInput.likeFlag == false) {
              await this.postsUnLike(likeInput.upID, likeInput.name);
            }
            if (likeInput.readFlag) {
              await this.postsView(likeInput.upID, likeInput.name);
            }
          } else if (likeInput.type == 'comment') {
            //
            if (likeInput.likeFlag) {
              await this.commentLike(likeInput.upID, likeInput.name);
            } else if (likeInput.likeFlag == false) {
              await this.commentUnLike(likeInput.upID, likeInput.name);
            }
            if (likeInput.readFlag) {
              await this.commentView(likeInput.upID, likeInput.name);
            }
          } else if (likeInput.type == 'task') {
          } else if (likeInput.type == 'proposal') {
          }
          return '';
        }
      } else {
        throw new ApiException(
          'post pushlish failed',
          ApiMsgCode.INFOMATION_PUBLISH_POSTS,
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (e) {
      throw new ApiException(
        'post pushlish failed',
        ApiMsgCode.INFOMATION_PUBLISH_POSTS,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async publish(postsUserInput: PostPublishData): Promise<string> {
    this.logger.debug(`information publish data: ${JSON.stringify(postsUserInput)}`);
    try {
      {
        const param = {
          ...postsUserInput,
          status: 'published',
        };
        if(postsUserInput.mode == 'draft') {
          param.status = 'draft';
        }
        const data = this.postsRepo.create(param);
        this.logger.debug(`post pushlish to database:${data}`);
        const res = await this.postsRepo.save(data);
        
        const giveRewardsDto = {
          name: postsUserInput.name,
          type: "post",
          rewards: 2
        }

        await this.accountService.giveRewards(giveRewardsDto);

        return res.postId;
      }
    } catch (e) {
      throw new ApiException(
        'post pushlish failed',
        ApiMsgCode.INFOMATION_PUBLISH_POSTS,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async comment(postsUserInput: CommentPublishData): Promise<string> {
    this.logger.log(`information comment data: ${JSON.stringify(postsUserInput)}`);
    try {
      if (postsUserInput.upID) {
        const postsData = await this.postsRepo.findOne({
          where: { postId: postsUserInput.upID },
        });
        if (!postsData) {
          throw new ApiException(
            'post pushlish failed',
            ApiMsgCode.INFOMATION_PUBLISH_POSTS,
            HttpStatus.BAD_REQUEST,
          );
        }
        console.log('postsUserInput==>', postsUserInput);
        const data = this.commentsRepo.create(postsUserInput);
        this.logger.debug(`comment posts data:${data}`);

        await this.commentsRepo.save(data);

        await this.postsRepo.update(
          {
            postId: postsData.postId,
          },
          {
            comments: ++postsData.comments,
          },
        );
        return postsData.name;
      } else {
        throw new ApiException(
          'post pushlish failed',
          ApiMsgCode.INFOMATION_PUBLISH_POSTS,
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (e) {
      throw new ApiException(
        'post pushlish failed',
        ApiMsgCode.INFOMATION_PUBLISH_POSTS,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async update(body: PostPublishData): Promise<string> {
    this.logger.debug(`information update data: ${JSON.stringify(body)}`);
    try {
      if(body.postId) {
        const postData = await this.postsRepo.find({
          where: {
            postId: body.postId,
            name: body.name,
          },
          skip: 0,
          take: 1,
        });
        if (postData && postData.length > 0) {
          const data = postData[0];
          data.content = body.content;
          data.title = body.title?body.title:data.title;
          data.images = body.images?body.images:data.images;
          data.tag = body.tag?body.tag:data.tag;
          data.brief = body.brief?body.brief:data.brief;
          data.addressInfo = body.addressInfo?body.addressInfo:data.addressInfo;
          data.mode = body.mode?body.mode:data.mode;
          data.top = body.top?body.top:data.top;

          this.logger.debug(`post pushlish to database:${postData}`);
          const res = await this.postsRepo.update({
              postId: data.postId,
              name: data.name,
              id: data.id,
            },
            data
          );
          return data.postId;
        }else {
          throw new ApiException(
            'post update failed',
            ApiMsgCode.INFOMATION_PUBLISH_POSTS,
            HttpStatus.BAD_REQUEST,
          );
        }
      }else {
        throw new ApiException(
          'post pushlish failed',
          ApiMsgCode.INFOMATION_PUBLISH_POSTS,
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (e) {
      throw new ApiException(
        'post pushlish failed',
        ApiMsgCode.INFOMATION_PUBLISH_POSTS,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async setStatus(body: PostStatusData): Promise<string> {
    this.logger.debug(`information update data: ${JSON.stringify(body)}`);
    try {
      if (body.status != 'draft' && body.status != 'submitted' && body.status != 'published'  ) {
        throw new ApiException(
          'post update status type failed: must draft,submitted,published',
          ApiMsgCode.INFOMATION_PUBLISH_POSTS,
          HttpStatus.BAD_REQUEST,
        );
      }
      if(body.postId) {
        const postData = await this.postsRepo.find({
          where: {
            postId: body.postId,
          },
          skip: 0,
          take: 1,
        });
        if (postData && postData.length > 0) {
          const data = postData[0];

          data.status = body.status
          this.logger.debug(`post pushlish to database:${postData}`);
          const res = await this.postsRepo.update({
              postId: data.postId,
              id: data.id,
            },
            data
          );
          return data.postId;
        }else {
          throw new ApiException(
            'post update failed',
            ApiMsgCode.INFOMATION_PUBLISH_POSTS,
            HttpStatus.BAD_REQUEST,
          );
        }
      }else {
        throw new ApiException(
          'post pushlish failed',
          ApiMsgCode.INFOMATION_PUBLISH_POSTS,
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (e) {
      throw new ApiException(
        'post pushlish failed',
        ApiMsgCode.INFOMATION_PUBLISH_POSTS,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async commentComment(postsUserInput: CommentPublishData):Promise<string> {
    try {
      if (postsUserInput.upID) {
        const postsData = await this.commentsRepo.findOne({
          where: { commentId: postsUserInput.upID },
        });
        if (!postsData) {
          throw new ApiException(
            'post pushlish failed',
            ApiMsgCode.INFOMATION_PUBLISH_POSTS,
            HttpStatus.BAD_REQUEST,
          );
        }
        const data = this.commentsRepo.create(postsUserInput);
        this.logger.debug(`comment comment data:${data}`);

        await this.commentsRepo.save(data);
        await this.commentsRepo.update(
          {
            commentId: postsData.commentId,
          },
          {
            comments: ++postsData.comments,
          },
        );
        return postsData.name;
      } else {
        throw new ApiException(
          'post pushlish failed',
          ApiMsgCode.INFOMATION_PUBLISH_POSTS,
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (e) {
      throw new ApiException(
        'post pushlish failed',
        ApiMsgCode.INFOMATION_PUBLISH_POSTS,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async listComments(current: number, take: number, upID: string) {
    // let first = '';
    // if (current > 1) {
    //   first = util.format(`AND comments."id"<'%d'`, current);
    // }
    const query = util.format(
      `SELECT comments.*,COALESCE(to_char(comments."createAt", 'YYYY-MM-DD HH24:MI:SS'), '') AS "createAt",\
      COALESCE(to_char(comments."updatedAt", 'YYYY-MM-DD HH24:MI:SS'), '') AS "updatedAt", profile1."nickName", profile2."nickName" AS replyNickName, profile1.avatar from comments LEFT JOIN profile AS profile1 on comments.name=profile1.name LEFT JOIN profile AS profile2 on comments.reply=profile2.name WHERE \
      comments."upID"='%s' ORDER BY comments."id" DESC LIMIT %d OFFSET %d`,
      upID,
      take,
      current,
    );
    const postsData = await this.postsRepo.query(query);
    const res: CommentListData = {
      count: postsData.length,
      data: postsData,
    };

    return res;
    // }
  }
  async getCommentList(listInput: CommentShowRequest): Promise<CommentListData>  {
    this.logger.debug(`list comment:${JSON.stringify(listInput)}`);
    let current = 0;
    let take = 100;
    try {
      // if (listInput.current) {
      //   current = listInput.current;
      // }
      // if (listInput.pageSize) {
      //   take = listInput.pageSize;
      // }
      if (listInput.pageSize) {
        take = listInput.pageSize;
      }
      if (listInput.current) {
        current = take * listInput.current;
      }
      if (listInput.upID) {
        return this.listComments(current, take, listInput.upID);
      } else {
        // 默认获取 post 时间倒序
        throw new ApiException(
          'post pushlish failed',
          ApiMsgCode.INFOMATION_PUBLISH_POSTS,
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (e) {
      throw new ApiException(
        'post pushlish failed',
        ApiMsgCode.INFOMATION_PUBLISH_POSTS,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async listPosts(current: number, take: number, type: string) {
    if (!type) {
      type = 'posts';
      // type = 'annouce'; AND posts."type"='%s'
    }
    // let first = '';
    // if (current > 1) {
    //   first = util.format(`posts."id"<'%d' AND`, current);
    // }
    const query = util.format(
      `SELECT posts.*, COALESCE(to_char(NOW(), 'YYYY-MM-DD HH24:MI:SS'), '') AS "now", COALESCE(to_char(posts."createAt", 'YYYY-MM-DD HH24:MI:SS'), '') AS "createAt",\
      COALESCE(to_char(posts."updatedAt", 'YYYY-MM-DD HH24:MI:SS'), '') AS "updatedAt",profile."nickName",profile.avatar FROM posts \
      left JOIN profile on posts.name=profile.name ORDER BY posts."top" DESC, posts."id" DESC LIMIT %d OFFSET %d`,
      take,
      current
    );
    const postsData = await this.postsRepo.query(query);
    this.logger.debug(`list postsData len:${postsData.length}`);
    const res: PostListData = {
      count: postsData.length,
      data: postsData,
    };
    return res;
  }

  async listUserPosts(current: number, take: number, name: string) {
    // let first = '';
    // if (current > 1) {
    //   first = util.format(`posts."id"<'%d' AND`, current);
    // }
    const query = util.format(
      `SELECT posts.*, COALESCE(to_char(posts."createAt", 'YYYY-MM-DD HH24:MI:SS'), '') AS "createAt",\
      COALESCE(to_char(posts."updatedAt", 'YYYY-MM-DD HH24:MI:SS'), '') AS "updatedAt",profile."nickName",profile.avatar FROM posts \
      left JOIN profile on posts.name=profile.name WHERE posts."name"='%s' ORDER BY posts."id" DESC LIMIT %d OFFSET %d`,
      name,
      take,
      current
    );
    const postsData = await this.postsRepo.query(query);
    this.logger.debug(`list postsData len:${postsData.length}`);
    const res: PostListData = {
      count: postsData.length,
      data: postsData,
    };
    return res;
  }  
  async listPostsByID(take: number, postId: string) {
    const query = util.format(
      `SELECT posts.*, COALESCE(to_char(posts."createAt", 'YYYY-MM-DD HH24:MI:SS'), '') AS "createAt",\
      COALESCE(to_char(posts."updatedAt", 'YYYY-MM-DD HH24:MI:SS'), '') AS "updatedAt",profile."nickName",profile.avatar FROM posts \
      left JOIN profile on posts.name=profile.name WHERE posts."postId"='%s' ORDER BY posts."createAt" DESC LIMIT 1 `,
      postId
    );
    const postsData = await this.postsRepo.query(query);
    const res: PostListData = {
      count: postsData.length,
      data: postsData,
    };

    return res;
  }
  async listPostsByStatus(current: number, take: number, status: string) {

    const query = util.format(
      `SELECT posts.*, COALESCE(to_char(NOW(), 'YYYY-MM-DD HH24:MI:SS'), '') AS "now", COALESCE(to_char(posts."createAt", 'YYYY-MM-DD HH24:MI:SS'), '') AS "createAt",\
      COALESCE(to_char(posts."updatedAt", 'YYYY-MM-DD HH24:MI:SS'), '') AS "updatedAt",profile."nickName",profile.avatar FROM posts \
      left JOIN profile on posts.name=profile.name WHERE posts.status='%s' ORDER BY posts."top" DESC, posts."id" DESC LIMIT %d OFFSET %d`,
      status,
      take,
      current
    );
    const postsData = await this.postsRepo.query(query);
    this.logger.debug(`list postsData len:${postsData.length}`);
    const res: PostListData = {
      count: postsData.length,
      data: postsData,
    };
    return res;
  }

  async getList(listInput: PostShowRequest) {
    this.logger.debug(`list: ${JSON.stringify(listInput)}`);
    let current = 0;
    let take = 100;
    try {
      // if (listInput.current) {
      //   current = listInput.current;
      // }
      // if (listInput.pageSize) {
      //   take = listInput.pageSize;
      // }
      if (listInput.pageSize) {
        take = listInput.pageSize;
      }
      if (listInput.current) {
        current = take * listInput.current;
      }
      if (listInput.postId) {
        // get id
        return await this.listPostsByID(take, listInput.postId);
      }
      if (listInput.status) {
        return await this.listPostsByStatus(current,take, listInput.status);
      }
      if (listInput.name) {
        // return this.listPosts(skip, take);
        return await this.listUserPosts(current, take, listInput.name);
      } else {
        return await this.listPosts(
          current,
          take,
          listInput.type,
        );
      }
    } catch (e) {
      throw new ApiException(
        'post pushlish failed',
        ApiMsgCode.INFOMATION_PUBLISH_POSTS,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  // async getCommentList(body: CommentShowRequest): Promise<CommentListData> {
  //   this.logger.debug(`information list comment data: ${JSON.stringify(body)}`);
  //   try {
  //     return await this.listComment(body);
  //   } catch (e) {
  //     throw new ApiException(
  //       'post pushlish failed',
  //       ApiMsgCode.INFOMATION_PUBLISH_POSTS,
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }
  // async getList(body: PostShowRequest): Promise<PostListData> {
  //   this.logger.debug(`information list data: ${JSON.stringify(body)}`);
  //   try {
  //     // how to get DAC publish avatar
  //     return await this.postsService.list(body).toPromise();
  //   } catch (e) {
  //     throw new ApiException(
  //       getRPCError(e),
  //       ApiMsgCode.INFOMATION_LIST_POSTS,
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }
  async listActive(body: ActiveShowRequest) {
    this.logger.debug(`list active param:${body}`);
    try {
      let likeFlag = false;
      let readFlag = false;
      // let attentionFlag = false;

      const likeData = await this.likesRepo.findOne({
        where: { name: body.name, likesID: body.upID },
      });
      if (likeData) {
        likeFlag = true;
      }
      const readData = await this.viewsRepo.findOne({
        where: { name: body.name, viewsID: body.upID },
      });
      if (readData) {
        readFlag = true;
      }

      const res: StatusActiveData = {
        name: body.name,
        upID: body.upID,
        likeFlag: likeFlag,
        readFlag: readFlag,
      };
      return res;
    } catch (e) {
      throw new ApiException(
        'post pushlish failed',
        ApiMsgCode.INFOMATION_PUBLISH_POSTS,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  // async listActive(body: ActiveShowRequest): Promise<StatusActiveData> {
  //   try {
  //     this.logger.debug(`information listActive data: ${JSON.stringify(body)}`);
  //     return await this.postsService.listMyStatus(body).toPromise();
  //   } catch (e) {
  //     throw new ApiException(
  //       getRPCError(e),
  //       ApiMsgCode.INFOMATION_ACTIVE_LIST,
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }
  async getMyPublishList(body: MyPublishRequest) {
    this.logger.debug(`-- getMyPublishList order data:${body}`);
    let current = 0;
    let take = 100;
    try {
      // if (listInput.current) {
      //   current = listInput.current;
      // }
      // if (listInput.pageSize) {
      //   take = listInput.pageSize;
      // }
      if (body.pageSize) {
        take = body.pageSize;
      }
      if (body.current) {
        current = take * body.current;
      }
      const query = util.format(
        `SELECT posts.*, COALESCE(to_char(posts."createAt", 'YYYY-MM-DD HH24:MI:SS'), '') AS "createAt",\
        COALESCE(to_char(posts."updatedAt", 'YYYY-MM-DD HH24:MI:SS'), '') AS "updatedAt",profile."nickName",profile.avatar FROM posts \
        left JOIN profile on posts.name=profile.name WHERE posts."name"='%s' ORDER BY posts."id" DESC LIMIT %d OFFSET %d`,
        body.name,
        take,
        current
      );
      const postsData = await this.postsRepo.query(query);

      const res: PostListData = {
        count: postsData.length,
        data: postsData,
      };

      return res;
    } catch (e) {
      throw new ApiException(
        'post pushlish failed',
        ApiMsgCode.INFOMATION_PUBLISH_POSTS,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async myPublishList(body: MyPublishRequest): Promise<PostListData> {
    try {
      this.logger.debug(
        `information myPublishList data: ${JSON.stringify(body)}`,
      );
      return await this.myPublishList(body);
    } catch (e) {
      throw new ApiException(
        'post pushlish failed',
        ApiMsgCode.INFOMATION_PUBLISH_POSTS,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async listLikes(listInput: LikeShowRequest):Promise<LikeListData> {
    this.logger.debug(`list likes:${JSON.stringify(listInput)}`);

    try {
      if (listInput.upID) {
        const query = util.format(
          `SELECT profile."nickName" from likes left JOIN profile on likes.name=profile.name WHERE \
          likes."likesID"='%s'`,
          listInput.upID,
        );
        const postsData = await this.postsRepo.query(query);

        const res: LikeListData = {
          count: postsData.length,
          data: postsData,
        };

        return res;
      } else {
        throw new ApiException(
          'post pushlish failed',
          ApiMsgCode.INFOMATION_PUBLISH_POSTS,
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (e) {
      throw new ApiException(
        'post pushlish failed',
        ApiMsgCode.INFOMATION_PUBLISH_POSTS,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  // async listLikes(body: LikeShowRequest): Promise<LikeListData> {
  //   try {
  //     this.logger.debug(`information listLikes data: ${JSON.stringify(body)}`);
  //     return await this.postsService.listLikes(body).toPromise();
  //   } catch (e) {
  //     throw new ApiException(
  //       getRPCError(e),
  //       ApiMsgCode.INFOMATION_ACTIVE_LIST,
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }
}
