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
  SignupUserReqDto,
  LoginUserDto,
  TokenResponse,
  LoginResponse,
  ListTaskRewardDto,
  AttentionRequest,
  AttentionShowRequest,
  AttentionListData,
  ListTaskRewardResponse
} from './dto'

import { AppLogger } from '../logger/logger';
import { AccountService } from './account.service';
import { FaceCheckData } from './dto/req/face.valid.dto';
import { FaceCheckResponse } from './dto/resp/face.valid.dto';
import { UsernameCheckData } from './dto/req/username.valid.dto';
import { UsernameCheckResponse } from './dto/resp/username.valid.dto';
import { ProfileData } from './dto/req/profile.dto';
import { ProfileCheckData } from './dto/req/profile.valid.dto';
import { ProfileCheckResponse } from './dto/resp/profile.valid.dto';
import { UserReqDto } from './dto/req/user.dto';

import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AssetResponseDto, AssetsDto } from './dto/resp/asset.dto';

@Controller('account')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private logger: AppLogger,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(
    @Body(ValidationPipe) body: LoginUserDto,
  ): Promise<TokenResponse> {
    return this.accountService.login(body);
  }


  @Post('signup')
  @HttpCode(HttpStatus.OK)
  public async signup(
    @Body(ValidationPipe) body: SignupUserReqDto,
  ): Promise<string> {
    return this.accountService.signup(body);
  }

  @Post('face/check')
  @HttpCode(HttpStatus.OK)
  public async CheckUserFace(
    @Body(ValidationPipe) body: FaceCheckData,
  ): Promise<FaceCheckResponse> {
    return this.accountService.checkUserFace(body);
  }

  /**
   * 
   * @param body 
   */
  @Post('check')
  @HttpCode(HttpStatus.OK)
  public async CheckUsername(
    @Body(ValidationPipe) body: UsernameCheckData,
  ): Promise<UsernameCheckResponse> {
    return this.accountService.checkUsername(body);
  }

  /**
   * update profile 
   * 
   * @param body 
   */
  @Post('profile/set')
  @HttpCode(HttpStatus.OK)
  public async Profile(
    @Body(ValidationPipe) body: ProfileData,
  ): Promise<string> {
    // 1. update IM  profile
    // 2. update profile
    return this.accountService.profile(body);
  }
  
  /**
   * check profile nickname
   * @param body 
   */
  @Post('profile/check')
  @HttpCode(HttpStatus.OK)
  public async ProfileValid(
    @Body(ValidationPipe) body: ProfileCheckData,
  ): Promise<ProfileCheckResponse> {
    // 1.
    return this.accountService.profileValid(body);
  }

  @Post('profile/show')
  @HttpCode(HttpStatus.OK)
  public async listProfile(
    @Body(ValidationPipe) body: UserReqDto,
  ): Promise<ProfileData> {
    return this.accountService.listProfile(body);
  }

  @Post('assets/symbol')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'show assets by symbol',
    description: 'show assets symbols for current user',
  })
  @ApiBody({
    description: '',
    type: UserReqDto,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: `update profile success`,
    type: AssetResponseDto,
  })
  public async getAssetBySymbol(
    @Body(ValidationPipe) body: UserReqDto,
  ): Promise<AssetsDto> {
    return this.accountService.getAssetBySymbol(body);
  }

  @Post('taskReward/receive')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'receive task rewards',
    description: "Collect and receive a user's all task rewards",
  })
  public async GetTaskReward(
    @Body(ValidationPipe) body: ListTaskRewardDto,
  ): Promise<string> {
    return await this.accountService.getTaskReward(body);
  }

  @Post('attention')
  @HttpCode(HttpStatus.OK)
  public async attention(
    @Body(ValidationPipe) body: AttentionRequest,
  ): Promise<string> {
    return this.accountService.attention(body);
  }
  @Post('attention/list')
  @HttpCode(HttpStatus.OK)
  public async listAttention(
    @Body(ValidationPipe) body: AttentionShowRequest,
  ): Promise<AttentionListData> {
    return this.accountService.listAttention(body);
  }

   /* show task reward list*/
   @Post('taskReward/list')
   @ApiOperation({
     summary: 'show task rewards list ',
     description: 'List a sequence of the task rewards',
   })
   @ApiResponse({
     status: 200,
     description: 'List a sequence of the task rewards successfully',
     type: ListTaskRewardDto,
   })
   public async listTaskReward(
     @Body(ValidationPipe) body: ListTaskRewardDto,
   ): Promise<ListTaskRewardResponse> {
     return await this.accountService.listTaskReward(body);
   }

}
