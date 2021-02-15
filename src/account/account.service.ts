import { forwardRef, Inject, Injectable, HttpStatus } from '@nestjs/common';
import * as moment from 'moment';
import * as config from 'config';

import {
  SignupUserReqDto,
  LoginUserDto,
  TokenResponse,
  UserDefaultInput,
  SetTaskStatusDto,
  TaskReceive,
  ListTaskRewardResponse,
  TaskStatus,
  AttentionRequest,
  AttentionShowRequest,
  AttentionListData,
} from './dto'
import { AppLogger } from '../logger/logger';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User, Profile, FinancialData, TasksData, Attention } from './entities';

import { CryptoUtil } from '../utils/crypto.util';
import { ApiException, ApiMsgCode } from '../shared';
import { FaceCheckResponse } from './dto/resp/face.valid.dto';
import { FaceCheckData } from './dto/req/face.valid.dto';
import { UsernameCheckData } from './dto/req/username.valid.dto';
import { UsernameCheckResponse } from './dto/resp/username.valid.dto';
import { ProfileData } from './dto/req/profile.dto';
import { ProfileCheckData } from './dto/req/profile.valid.dto';
import { ProfileCheckResponse } from './dto/resp/profile.valid.dto';
import { UserReqDto } from './dto/req/user.dto';
import { AssetsDto } from './dto/resp/asset.dto';
import * as util from 'util';
import { RandomName, ValidAccount } from '../shared';
import { ConfigService } from '../config/config.service';
import { ChainService } from '../chain/chain.service';
import { toChainEntityName, toChainAssetFromSymbolCode } from '../chain/utils';
import { NewAcctDto } from '../chain/dto';
import { XtansferInfo } from '../chain/interfaces';
import { ListTaskRewardDto } from './dto/req/list.dto';
import { MarkTaskInput } from './interfaces/dac.interface';
import { GiveRewardsDto } from './dto/req/give.reward.Dto';
import { BlockChainService } from 'src/task/blockchain.service';

@Injectable()
export class AccountService {
  constructor(
    private logger: AppLogger,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Profile) private readonly profileRepo: Repository<Profile>,
    @InjectRepository(FinancialData) private readonly financialRepo: Repository<FinancialData>,
    @InjectRepository(TasksData) private readonly tasksRepo: Repository<TasksData>,
    @InjectRepository(Attention)
    private readonly attentionsRepo: Repository<Attention>,
    @Inject(CryptoUtil) private readonly cryptoUtil: CryptoUtil,
    @Inject(ChainService)
    private readonly chainService: ChainService,
    private readonly configService: ConfigService,
    private readonly blockChainService: BlockChainService

  ) {}

  /**
   * check if user is exist and user is banned or recycle
   *
   * @param user user
   */
  private checkUserStatus(user: User) {
    if (!user) {
      this.logger.log('not found user');
      throw new ApiException(
        'user exist',
        ApiMsgCode.SIGNUP_FAILED,
        HttpStatus.BAD_REQUEST,
      );
    }
    // if (user.banned) {
    //   this.logger.log(`user is baned: ${JSON.stringify(user)}`);

    //   throw new RpcException({
    //     code: ErrorCode.UserBannedError,
    //     message: t('User is banned'),
    //   });
    // }
  }

  async login(body: LoginUserDto) {
    // login TODO
    //const resp = await this.LoginFace();
    // first check local or resp name
    this.logger.log(`login user: ${JSON.stringify(body)}`);
    const user = await this.userRepo
      .createQueryBuilder('user')
      .orWhere('user.username = :username', { username: body.username })
      // .orWhere('user.faceId = :faceId', { faceId: body.faceId })
      .getOne();
    await this.checkUserStatus(user);
    if (body.username)
      if (
        !(await this.cryptoUtil.checkPassword(body.password, user.password))
      ) {
        this.logger.error(`login password failed username:${body.username}`);
        throw new ApiException(
          'user login failed',
          ApiMsgCode.SIGNUP_FAILED,
          HttpStatus.BAD_REQUEST,
        );
      }
    const tokenInfo: TokenResponse = {
      name: user.name,
    };

    
    const taskConfig = config.get<string>('tasks')
    const giveRewardsDto = {
      "name" : user.name,
      "type" : "login",
      "rewards" : taskConfig.login.rewards
    }
    await this.giveRewards(giveRewardsDto)

    return tokenInfo;
  }


  private checkUserNotExist(user: User) {
    if (user)
      throw new ApiException(
        'user exist',
        ApiMsgCode.SIGNUP_FAILED,
        HttpStatus.BAD_REQUEST,
      );
  }

  public async signup(body: SignupUserReqDto): Promise<string> {
    this.logger.log(`signup body: ${JSON.stringify(body)}`);
    const user = await this.userRepo
      .createQueryBuilder('user')
      .orWhere('user.username = :username', { username: body.username })
      .getOne();
    await this.checkUserNotExist(user);
    if (body.password) {
      body.password = await this.cryptoUtil.encryptPassword(body.password);
    }
    let chainAcct = '';
    let i = 0;
    for (i = 0; i < 5; i++) {
      try {
        chainAcct = RandomName();
        const acctData: NewAcctDto = {
          name: toChainEntityName(chainAcct),
        };
        if (!ValidAccount(chainAcct)) {
          this.logger.warn('account valid !!!');
          continue;
        }
        this.logger.debug(`chain name :${chainAcct}`);
        const chainData = await this.chainService.newacct(acctData);
        const usdTokenContract = this.configService
                      .getLocalConfig()
                      .get('usdTokenContract');
        // TODO: issue core token,it will remove after beta version
        const issueReq: XtansferInfo = {
          from: toChainEntityName(usdTokenContract),
          to: toChainEntityName(chainAcct),
          foQuantity: {
            contract: toChainEntityName(usdTokenContract),
            quantity: toChainAssetFromSymbolCode(
              '3000',
              this.configService.getLocalConfig().get('usdcTokenSymbol'),
              this.configService.getLocalConfig().get('usdTokenDecimals'),
            ),
          },
          memo: 'user register token issue',
        };
        console.log(issueReq);
        await this.chainService.xtransfer(issueReq);
        this.logger.debug(`chain id=${chainData.transactionId}`);
        break;
      } catch (e) {
        this.logger.warn(`create new account error: ${e}`);
        continue;
      }
    }
    if (i == 5) {
      throw new ApiException(
        'user signup failed',
        ApiMsgCode.SIGNUP_FAILED,
        HttpStatus.BAD_REQUEST,
      );
    }
    const param = {
      ...body,
      name: chainAcct,
    };
    
    const payload = this.userRepo.create(param);
    await this.userRepo.save(payload);

    // profile 
    const pf: UserDefaultInput = {
      username: body.fullname ? body.fullname : body.username,
      name: param.name,
      photo: body.photo
    };
    await this.defaultProfile(pf);

    // give tokens 
    // await this.giveTokens("3000", body.username);

    return param.name;
  }

  async defaultProfile(body: UserDefaultInput): Promise<string> {
    const data: ProfileData = {
      name: body.name,
      avatar: body.photo,
      nickName: body.username,
      gender: '',
      address: '',
      profile: '',
      birthday: '',
    };
    return await this.profile(data);
  }

  async checkUserFace(payload: FaceCheckData): Promise<FaceCheckResponse> {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .where('user.faceId = :faceId', {
        faceId: payload.faceId,
      })
      .getOne();
    const data: FaceCheckResponse = {
      faceId: payload.faceId,
      used: false,
    };
    if (user) {
      data.used = true;
    }
    return data;
  }

  async checkUsername(payload: UsernameCheckData) {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .where('user.username = :username', {
        username: payload.username,
      })
      .getOne();
    const data: UsernameCheckResponse = {
      username: payload.username,
      used: false,
    };
    if (user) {
      data.used = true;
    }
    return data;
  }

  // async profile(body: ProfileData): Promise<string> {
  //   this.logger.debug(`profile user! ${JSON.stringify(body)}`);
  //   try {
  //     // TODO 1. check profile nickName is used
  //     //TODO set IM profile
  //     // dac profile use dac ID as name
  //     const { data } = await this.userService.profile(body).toPromise();
  //     return data;
  //   } catch (error) {
  //     console.log(error);
  //     throw new ApiException(
  //       getRPCError(error),
  //       ApiMsgCode.USER_PROFILE_FAILED,
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }

  /**
   * udpate user profile
   * 
   * @param updateUserInput 
   */
  async profile(updateUserInput: ProfileData): Promise<string> {
    console.log('profile :', updateUserInput);

    try {
      console.log('user create to save!!!');
      const user = await this.profileRepo
        .createQueryBuilder('profile')
        .orWhere('profile.name = :name', { name: updateUserInput.name })
        .getOne();
      if (!user) {
        this.logger.debug(`new profile: ${JSON.stringify(updateUserInput)}`);
        await this.profileRepo.save(this.profileRepo.create(updateUserInput));
      } else {
        this.logger.debug(`update profile: ${JSON.stringify(updateUserInput)}`);
        await this.profileRepo.update(
          {
            name: updateUserInput.name,
          },
          {
            avatar: updateUserInput.avatar,
            nickName: updateUserInput.nickName,
            gender: updateUserInput.gender,
            address: updateUserInput.address,
            profile: updateUserInput.profile,
            qrCode: '',
            birthday: updateUserInput.birthday,
          },
        );
      }

      return "success"
    } catch (e) {
      this.logger.error(
        `profile user failed, profile update failed input:${JSON.stringify(
          updateUserInput,
        )}`,
      );
      throw new ApiException(
        'udpate user profile failed',
        ApiMsgCode.USER_PROFILE_UPDATE_FAILED,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async profileValid(
    updateUserInput: ProfileCheckData,
  ): Promise<ProfileCheckResponse> {
    this.logger.debug(`profile: ${JSON.stringify(updateUserInput)}`);
    try {
      console.log('user create to save!!!');
      const user = await this.profileRepo
        .createQueryBuilder('profile')
        .orWhere('profile.nickName = :nick', { nick: updateUserInput.nickName })
        .getOne();
      const result: ProfileCheckResponse = {
        name: updateUserInput.name,
        nickName: updateUserInput.nickName,
        used: false,
      };
      if (user) {
        result.used = true;
      }
      return result;
    } catch (e) {
      this.logger.error(
        `profile user failed, profile update failed input:${JSON.stringify(
          updateUserInput,
        )}`,
      );

      throw new ApiException(
        'ProfileValid failed',
        ApiMsgCode.USER_PROFILE_VALID_FAILED,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * Ordinary user registration
   *
   * @param updateUserInput createUserInput
   */
  async listProfile(updateUserInput: UserReqDto): Promise<ProfileData> {
    console.log('listProfile :', updateUserInput);
    try {
      const defaultUser: ProfileData = {
        name: '',
        avatar: '',
        nickName: '',
        gender: '',
        address: '',
        profile: '',
        birthday: '',
      };
      const user = await this.profileRepo
        .createQueryBuilder('profile')
        .where('profile.name = :name', {
          name: updateUserInput.name,
        })
        .orderBy('profile.updatedAt', 'DESC')
        .getOne();
      if (user) {
        this.logger.debug(`listProfile user: ${JSON.stringify(user)}`);
        defaultUser.address = user.address;
        defaultUser.avatar = user.avatar;
        defaultUser.nickName = user.nickName;
        defaultUser.gender = user.gender;
        defaultUser.profile = user.profile;
        defaultUser.name = user.name;
        defaultUser.birthday = user.birthday;
      }
      return defaultUser;
    } catch (e) {
      this.logger.error(
        `list profile user failed, profile find failed input:${JSON.stringify(
          updateUserInput,
        )}`,
      );
      throw new ApiException(
        'profile find failed',
        ApiMsgCode.USER_PROFILE_VALID_FAILED,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async giveTokens(amount: string, name: string) {
    try {
      const symbol = config.get<string>('tokenInfo').symbol;
      const param = {
        name: name,
        amount: amount,
        symbol: symbol,
        quantity: `${amount}.0000 ${symbol}` // 1.0000 UTU
      };
      
      const payload = this.financialRepo.create(param);
      await this.financialRepo.save(payload);

    } catch (error) {
      this.logger.error(
        `giveTokens failed`
      );
      throw new ApiException(
        'giveTokens failed',
        ApiMsgCode.USER_PROFILE_VALID_FAILED,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async getAssetBySymbol(body: UserReqDto): Promise<AssetsDto> {
    try {
      this.logger.debug(`get user getAssetsBySymbol: ${JSON.stringify(body)}`);
      // 1. token list
      const query = util.format(
        `SELECT financial.name as "name",financial.symbol as "symbol", \
        financial.quantity as "quantity", amount \ 
        FROM financial \
        WHERE financial."name"='%s'`,
        body.name
      );
      this.logger.log(query);
      const tokensData = await this.financialRepo.query(query);
      // 2. for get rate and calc
      if (tokensData && tokensData.length > 0) {
        const result = tokensData[0];
        result.assets = '';
        this.logger.debug(`get token: ${JSON.stringify(result)}`);
        return result;
      }

      // if empty
      const tokenInfo = config.get<string>('tokenInfo');
      const res: AssetsDto = {
        name: body.name,
        tokenIcon: tokenInfo.icon,
        symbol: tokenInfo.symbol,
        amount: '0',
        quantity: '',
        assets: ''
      };
      return res;
    } catch (error) {
      this.logger.error(
        `get transfer history by user failed, user param miss input:${JSON.stringify(
          body,
        )}`,
      );
      throw new ApiException(
        'User tokens by symbol failed',
        ApiMsgCode.USER_PROFILE_VALID_FAILED,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async listTaskReward(
    body: ListTaskRewardDto,
  ): Promise<any> {
    try {
      this.logger.log(`task event stream body: ${JSON.stringify(body)}`);
      const query = util.format(
        `SELECT dac_tasks.*
        FROM dac_tasks \
        WHERE dac_tasks."executor"='%s' \
        AND dac_tasks."status"=2 \
        ORDER BY dac_tasks."id" DESC`,
        body.name
      );
      
      const rewards = await this.tasksRepo.query(query);
      console.log(rewards);

      return {
        data: {
          rewards: rewards
        },
      };
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * transfer token from system to user
   * 
   * @param name 
   * @param amount 
   */
  async transferToken(name: string, amount: string) {
    try {
      const usdTokenContract = this.configService
      .getLocalConfig()
      .get('usdTokenContract');

      const issueReq: XtansferInfo = {
        from: toChainEntityName(usdTokenContract),
        to: toChainEntityName(name),
        foQuantity: {
        contract: toChainEntityName(usdTokenContract),
        quantity: toChainAssetFromSymbolCode(
          amount,
          this.configService.getLocalConfig().get('usdcTokenSymbol'),
          this.configService.getLocalConfig().get('usdTokenDecimals'),
        ),
      },
      memo: 'user collect rewards',
      };
      console.log(issueReq);
      await this.chainService.xtransfer(issueReq);

    } catch (e) {
      console.log(e);
      
      throw new ApiException(
        'transferToken failed',
            ApiMsgCode.USER_PROFILE_VALID_FAILED,
            HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * collect 
   * 
   * @param body 
   */
  async getTaskReward(body: ListTaskRewardDto): Promise<string> {
    try {
      this.logger.log(`task event stream body: ${JSON.stringify(body)}`);
      const { data } = await this.listTaskReward(body);

      const result = [];
      let total = 0;

      for (let i = 0; i < data.rewards.length; i++) {
        const item = data.rewards[i];
        if (item.type === 'writingReward') {
          const extra = JSON.parse(item.extra)
          console.log('writingReward');
          console.log(extra);

          const res = await this.blockChainService.pay(
            extra.contractId,
            extra.sender,
            extra.amount.toString()
          );

          console.log(res);

        } else {
          total += item.receive;
        }

        try {
          const reqStatus: SetTaskStatusDto = {
            taskId: item.taskId,
            executorId: item.executor,
            dacId: item.dacId,
            id: item.id,
          };
          this.logger.debug(`get reqStatus:${JSON.stringify(reqStatus)}`);
          await this.markTaskRewardClaimed(reqStatus);
        } catch (e) {
          this.logger.warn(`get reward failed: ${JSON.stringify(item)}`);
          result.push(item);
        }
      }

      // update asset balance using db
      // if (total > 0) {
      //   try {
      //     const symbol = config.get<string>('tokenInfo').symbol;
      //     const asset = await this.getAssetBySymbol({
      //       name: body.name,
      //       tokenSymbol: ''
      //     });

      //     console.log(asset);

      //     const amount = parseInt(asset.amount) + total;
      //     const quantity = `${amount} ${symbol}`;

      //     const query = util.format(
      //       `UPDATE financial SET amount = %d, \
      //       quantity = '%s' \ 
      //       WHERE financial."name"='%s'`,
      //       amount,
      //       quantity,
      //       body.name
      //     );

      //     console.log(query);
          
      //     await this.financialRepo.query(query);
    
      //   } catch (error) {
      //     this.logger.error(
      //       `update asset balance failed`
      //     );
      //     throw new ApiException(
      //       'update asset balance failed',
      //       ApiMsgCode.USER_PROFILE_VALID_FAILED,
      //       HttpStatus.BAD_REQUEST
      //     );
      //   }
      // }
      
      // update asset balance using chain
      if (total > 0) {
        await this.transferToken(body.name, total.toString());
      }

      if (result.length > 0) {
        return JSON.stringify(result);
      }
      return 'success';

    } catch (e) {
      console.log(e);
      
      throw new ApiException(
        'getTaskReward failed',
            ApiMsgCode.USER_PROFILE_VALID_FAILED,
            HttpStatus.BAD_REQUEST
      );
    }
  }

  async attention(attentionInput: AttentionRequest): Promise<string> {
    this.logger.debug(`attention data:${attentionInput}`);
    try {
      // 查询是否存在 id
      if (attentionInput.upUser && attentionInput.name) {
        if (attentionInput.actionType == true) {
          const findData = await this.attentionsRepo.findOne({
            where: {
              name: attentionInput.name,
              upUser: attentionInput.upUser,
            },
          });
          if (!findData) {
            const attentionData = {
              name: attentionInput.name,
              upUser: attentionInput.upUser,
            };
            const data = this.attentionsRepo.create(attentionData);
            await this.attentionsRepo.save(data);
          }
        } else if (attentionInput.actionType == false) {
          const findData = await this.attentionsRepo.findOne({
            where: {
              name: attentionInput.name,
              upUser: attentionInput.upUser,
            },
          });
          if (findData) {
            await this.attentionsRepo.remove(findData);
          }
        }
        return 'ok';
      } else {
        throw new ApiException(
          'attention failed',
          ApiMsgCode.USER_PROFILE_VALID_FAILED,
          HttpStatus.BAD_REQUEST
        );
      }
    } catch (e) {
      throw new ApiException(
        'attention failed',
        ApiMsgCode.USER_PROFILE_VALID_FAILED,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async markTaskRewardClaimed(body: MarkTaskInput) {
    this.logger.log(`markTaskReward >>>>>>>>>>>> body:${JSON.stringify(body)}`);
    const nowTime = new Date();
    const reuslt: UpdateResult = await this.tasksRepo.update(
      { taskId: body.taskId, executor: body.executorId, id: body.id },
      {
        status: TaskReceive.COMPLETED,
        rewardAt: moment(nowTime).format('YYYY-MM-DD HH:mm:ss'),
      },
    );
    console.log('result ................', reuslt);
    return {
      data: reuslt.affected,
    };
  }

  /**
   * give rewards to someone
   * 
   * @param data 
   */
  async giveRewards(body : GiveRewardsDto) : Promise<number>{
    try {
      const taskData: TasksData = new TasksData();
      taskData.status = TaskReceive.WAITING; 
      taskData.receive = body.rewards;
      taskData.executor = body.name;
      taskData.type = body.type;
      // taskData.taskId = "";
      taskData.executeNum = 1;
      taskData.extra = body.extra ? body.extra : ''

      const res = await this.tasksRepo.create(taskData);
      await this.tasksRepo.save(res);

      return 1
    } catch (e) {
      throw new ApiException(
        'giveRewards failed',
          ApiMsgCode.USER_PROFILE_VALID_FAILED,
          HttpStatus.BAD_REQUEST
        );
      }
  }

  async listAttention(body: AttentionShowRequest): Promise<AttentionListData> {
    this.logger.debug(`list attention param:${JSON.stringify(body)}`);
    let current = 0;
    let take = 100;
    try {

      if (body.pageSize) {
        take = body.pageSize;
      }
      if (body.current) {
        current = take * body.current;
      }
      this.logger.debug(`get followers: ${take} ${current}`);

      // 先查询关注列表
      let queryList = '';
      if (body.role == 'followers') {
        queryList = util.format(`select attentions.name as name,profile."nickName",profile.avatar FROM attentions \
            left JOIN profile on attentions.name=profile.name where "upUser"='%s' ORDER BY attentions."id" DESC LIMIT %d OFFSET %d`,
            body.name,
            take,
            current
          );

      } else if (body.role == 'following'){
        queryList = util.format(
          `select attentions."upUser" as name, profile."nickName",profile.avatar FROM attentions \
          left JOIN profile on attentions.name=profile.name where attentions.name='%s' ORDER BY attentions."id" DESC LIMIT %d OFFSET %d`,
          body.name,
          take,
          current
        );
      this.logger.debug(`get following: ${queryList}`);
     }else {
        throw new ApiException(
          'attention failed',
          ApiMsgCode.USER_PROFILE_VALID_FAILED,
          HttpStatus.BAD_REQUEST
        );
      }
      const res: AttentionListData = {
        count: 0,
        data: [],
      };
      this.logger.debug(`get queryList: ${queryList}`);
      const userDataList = await this.attentionsRepo.query(queryList);
      if(userDataList && userDataList.length > 0) {
        res.count = userDataList.length;
        res.data = userDataList;
      }
      return res;
    } catch (e) {
      throw new ApiException(
        'attention failed',
        ApiMsgCode.USER_PROFILE_VALID_FAILED,
        HttpStatus.BAD_REQUEST
      );
    }
  }

}
