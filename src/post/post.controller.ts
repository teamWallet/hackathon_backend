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
  PostPublishData,
  CommentPublishData,
  NormalResponse,
  PostShowRequest,
  CommentShowRequest,
  PostListData,
  PostShowListData,
  CommentListData,
  CommentShowListData,
  ActiveShowRequest,
  ListActiveResponse,
  // ActiveShowResponse,
  LikeShowRequest,
  LikeListData,
  MyPublishRequest,
  StatusActiveData,
  UniversalResponse,
  UniversalTaskResponseDto,
  PostActiveDataDto,
  PostStatusData,
} from './dto'
import { AppLogger } from '../logger/logger';
import { PostService } from './post.service';
@ApiTags("Post")
@Controller('post')
export class PostController {
  constructor(private readonly informationService: PostService) {}

  @Post('publish')
  @ApiOperation({
    summary: 'publish a post',
    description:
      'Publishing a new post in community with dac created (dacId must provided)',
  })
  @ApiBody({
    description: ``,
    type: PostPublishData,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Publish a post in dac successfully',
    type: NormalResponse,
  })
  public async publish(
    @Body(ValidationPipe) body: PostPublishData,
  ): Promise<string> {
    return this.informationService.publish(body);
  }

  @Post('comment')
  @ApiOperation({
    summary: 'comment a post',
    description: 'Comment a post which is published in dac',
  })
  @ApiBody({
    description: ``,
    type: CommentPublishData,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Comment successfully',
    type: NormalResponse,
  })
  public async comment(
    @Body(ValidationPipe) body: CommentPublishData,
  ): Promise<string> {
    return this.informationService.comment(body);
  }

  @Post('update')
  @ApiOperation({
    summary: 'update a post information',
    description: 'Change the contents of a published post',
  })
  @ApiBody({
    description: ``,
    type: PostPublishData,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Update post successfully',
    type: NormalResponse,
  })
  public async update(
    @Body(ValidationPipe) body: PostPublishData,
  ): Promise<string> {
    return this.informationService.update(body);
  }
  @Post('config')
  @ApiOperation({
    summary: 'config a post information',
    description: 'Change the contents of a published post',
  })
  @ApiBody({
    description: ``,
    type: PostStatusData,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Update post successfully',
    type: NormalResponse,
  })
  public async setConfig(
    @Body(ValidationPipe) body: PostStatusData,
  ): Promise<string> {
    return this.informationService.setStatus(body);
  }
  @Post('list')
  @ApiOperation({
    summary: 'list all published contents for a dac',
    description: 'List out all published contents for a specified dac',
  })
  @ApiBody({
    description: ``,
    type: PostShowRequest,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'List community information successfully',
    type: PostShowListData,
  })
  public async getList(
    @Body(ValidationPipe) body: PostShowRequest,
  ): Promise<PostListData> {
    return this.informationService.getList(body);
  }

  @Post('comment/list')
  @ApiOperation({
    summary: 'get comment list',
    description: "Get a community's list of all comments",
  })
  @ApiBody({
    description: ``,
    type: CommentShowRequest,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Get list of comments to specified post id',
    type: CommentShowListData,
  })
  public async getCommentList(
    @Body(ValidationPipe) body: CommentShowRequest,
  ): Promise<CommentListData> {
    return this.informationService.getCommentList(body);
  }

  @Post('active')
  @ApiOperation({
    summary: 'operate likes, views and collections',
    description:
      'Perform likes, views and collections operations to specified post/comment by upID',
  })
  @ApiBody({
    description: ``,
    type: PostActiveDataDto,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Operating likes, views and collections successfully',
    type: UniversalTaskResponseDto,
  })
  public async active(
    @Body(ValidationPipe) body: PostActiveDataDto,
  ): Promise<string> {
    return this.informationService.active(body);
  }

  @Post('active/list')
  @ApiOperation({
    summary: 'get operation execution status for the current user',
    description:
      "List the current user's (specified by name of the user) status of performing likes, views, collections, to specified post/comment",
  })
  @ApiBody({
    description: ``,
    type: ActiveShowRequest,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'List user activation status successfully',
    type: ListActiveResponse,
  })
  public async listActive(
    @Body(ValidationPipe) body: ActiveShowRequest,
  ): Promise<StatusActiveData> {
    return this.informationService.listActive(body);
  }

  @Post('publish/my')
  @ApiOperation({
    summary: "show information of all current user's publication",
    description: "Get a list of all my dac's publications",
  })
  @ApiBody({
    description: ``,
    type: MyPublishRequest,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: "Get the list of the user's published contents successfully",
    type: ListActiveResponse,
  })
  public async MyPublishList(
    @Body(ValidationPipe) body: MyPublishRequest,
  ): Promise<PostListData> {
    return this.informationService.myPublishList(body);
  }

  @Post('/likes/list')
  @ApiOperation({
    summary: 'show likes for specified published contents',
    description:
      'Show nickNames of the users who liked the specified published content',
  })
  @ApiBody({
    description: ``,
    type: LikeShowRequest,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Get list of user nickNames successfully',
    type: ListActiveResponse,
  })
  public async ListLikes(
    @Body(ValidationPipe) body: LikeShowRequest,
  ): Promise<LikeListData> {
    return this.informationService.listLikes(body);
  }
}
