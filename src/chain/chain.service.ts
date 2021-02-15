/* eslint-disable @typescript-eslint/camelcase */
import {
  Action,
  TransactDto,
  NewAcctDto,
  ResponseAllDto,
  CallActionDto,
  BalanceDto,
  VoteDto,
  ProposeDto,
  ResponseBalanceDto,
  OperationProposalDto,
  ExchangeDto,
  ExchangeV2Dto,
  ClosePairTokenDto,
  ExtendedAssetDto,
  LogRecordDto,
  DacConfigDto,
} from './dto';

import {
  MemberregInfo,
  MemberunregInfo,
  NominatecandInfo,
  StakeInfo,
  BaseDacInfo,
  PremiumDacInfo,
  CustomDacInfo,
  Upgrade2PremiumInfo,
  XtansferInfo,
  TreasuryxferInfo,
  //proposal
  PropChangeCustParams,
  PropTransferInfo,
  CreateContractInfo,
  PayContractInfo,
  CancelContractInfo,
  AcceptContractInfo,
  ApproveContractInfo,
  BurnContractInfo,
} from './interfaces';
import { ChainEntityName, ChainSymbolCode } from './types';

import {
  toChainEntityName,
  toChainAsset,
  toChainSymbol,
  toChainAssetFromSymbolCode,
  toChainDate,
  toChainSymbolCode,
} from './utils';
import { CandidateInfo, CustodianConfig, CustodianInfo } from './interfaces';

import { ConfigService } from '../config/config.service';
import { ActionsHelperService } from './actionsHelper.service';
import { ApiException, ApiMsgCode } from '../shared';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { NotaddGrpcClientFactory } from '../grpc/grpc.client-factory';
import { utuModuleChain } from '../grpc/chain.generated';
import { stringify } from 'flatted';
import { RpcException } from '@nestjs/microservices';
import { ACCT_TYPE } from '../config/dacdirectory';
import { asset } from 'eos-common';
import { Serialize } from 'eosjs';

function getChainErorr(error: RpcException | Error): string {
  let errorMessage = '';
  if (error instanceof Error) {
    errorMessage = `${error.name} ${error.message}`;
  } else {
    errorMessage = stringify(error);
  }
  return errorMessage;
}

@Injectable()
export class ChainService {
  async onModuleInit(): Promise<void> {
    this.chainService = this.notaddGrpcClientFactory.chainModuleClient.getService(
      'ChainService',
    );
  }

  private defaultAuth = 'active';
  private custodianConfig: CustodianConfig;
  private candidates: CandidateInfo[];
  private chainService: utuModuleChain.ChainService;
  private sysId = toChainEntityName('dacdac');
  constructor(
    @Inject(NotaddGrpcClientFactory)
    private readonly notaddGrpcClientFactory: NotaddGrpcClientFactory,
    private readonly configService: ConfigService,
    private readonly actionsHelperService: ActionsHelperService,
  ) {}

  randomName() {
    let name = '';
    const possible = 'abcdefghijklmnopqrstuvwxyz12345';
    for (let i = 0; i < 12; i++) {
      name += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return toChainEntityName(name);
  }

  async serializeActionData(action: Action): Promise<string> {
    try {
      const account = action.account;
      const name = action.name;
      const data = action.data;
      const contract = await this.configService
        .getEosApi()
        .getContract(account);
      const hex = Serialize.serializeActionData(
        contract,
        account,
        name,
        data,
        new TextEncoder(),
        new TextDecoder(),
      );
      return hex;
    } catch (e) {
      throw new ApiException(
        getChainErorr(Error(`Serialize ` + e.stack.split('\n')[0])),
        ApiMsgCode.CHAIN_SERIALIZE_ACTION_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  makeCustConfig(
    numelected: number,
    symbolCode: ChainSymbolCode,
    periodlength: number,
  ): DacConfigDto {
    const zeroDacAsset = {
      contract: toChainEntityName(
        this.configService.getLocalConfig().get('coreDacTokenContract'),
      ),
      quantity: toChainAssetFromSymbolCode('0.0000', symbolCode),
    };
    return {
      lockupasset: zeroDacAsset,
      maxvotes: numelected,
      numelected: numelected,
      periodlength: periodlength,
      should_pay_via_service_provider: false,
      initial_vote_quorum_percent: 0,
      vote_quorum_percent: 0,
      auth_threshold_high: Math.floor(numelected / 2) + 1,
      auth_threshold_mid: Math.floor(numelected / 2) + 1,
      auth_threshold_low: Math.floor(numelected / 2) + 1,
      lockup_release_time_delay: 1233,
      requested_pay_max: zeroDacAsset,
    };
  }
  async getCandidatePermissions(dacId: string) {
    try {
      const candPermTab = await this.chainService
        .getTableRows({
          json: true,
          code: this.configService.getLocalConfig().get('custodiancontract'),
          scope: toChainEntityName(dacId),
          table: toChainEntityName('candperms'),
          limit: -1,
        })
        .toPromise();
      if (candPermTab && candPermTab.rows) {
        if (typeof candPermTab.rows === 'string') {
          candPermTab.rows = JSON.parse(candPermTab.rows);
        }
      } else {
        return [];
      }

      return candPermTab.rows;
    } catch (error) {
      throw new ApiException(
        getChainErorr(error),
        ApiMsgCode.CHAIN_GET_TABLE_ROWS_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getCustodianPermissions(dacId: string, numelected: number) {
    const customCandPermissions = await this.getCandidatePermissions(dacId);
    let candidates = await this.getCandidates(dacId);
    if (candidates) {
      candidates = candidates.filter(c => c.isActive);
    } else {
      return [];
    }

    candidates.sort((a, b) => {
      return +b.totalVotes - +a.totalVotes;
    });
    if (+candidates[0].totalVotes === 0) {
      //TODO: sort candidates form custodian if Max totalVote is 0
      const custodian: CustodianInfo[] = await this.getCustodians(dacId);
      for (const value of custodian) {
        let index = 0;
        let cand = candidates[0];
        let find = false;
        for (const data of candidates) {
          if (data.candidateName == value.custodianName) {
            cand = data;
            find = true;
            break;
          }
          index++;
        }
        if (find) {
          candidates.splice(index, 1);
          candidates.unshift(cand);
        }
      }
    }
    const requested = candidates.slice(0, numelected * 2).map(c => {
      let permission = 'active'; // default
      const custom = customCandPermissions.find(
        ccp => ccp.cand === c.candidateName,
      );
      if (custom) {
        permission = custom.permission;
      }
      return {
        actor: toChainEntityName(c.candidateName),
        permission: toChainEntityName(permission),
      };
    });
    return requested;
  }
  public async getCandidates(dacId: string): Promise<CandidateInfo[]> {
    try {
      const candidatesTab = await this.chainService
        .getTableRows({
          json: true,
          code: this.configService.getLocalConfig().get('custodiancontract'),
          scope: toChainEntityName(dacId),
          table: toChainEntityName('candidates'),
          limit: -1,
        })
        .toPromise();
      if (candidatesTab && candidatesTab.rows) {
        if (typeof candidatesTab.rows === 'string') {
          candidatesTab.rows = JSON.parse(candidatesTab.rows);
        }
      } else {
        return [];
      }

      const cands: CandidateInfo[] = [];
      candidatesTab.rows.forEach(cand => {
        cands.push({
          candidateName: cand.candidate_name,
          requestedpay: cand.requestedpay,
          lockedTtokens: cand.locked_tokens,
          totalVotes: cand.total_votes,
          isActive: cand.is_active,
          custodianEndTimeStamp: cand.custodian_end_time_stamp,
        });
      });
      return cands;
    } catch (error) {
      throw new ApiException(
        getChainErorr(error),
        ApiMsgCode.CHAIN_GET_TABLE_ROWS_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  public async getCustodians(dacId: string): Promise<CustodianInfo[]> {
    try {
      const candidatesTab = await this.chainService
        .getTableRows({
          json: true,
          code: this.configService.getLocalConfig().get('custodiancontract'),
          scope: toChainEntityName(dacId),
          table: toChainEntityName('custodians'),
          limit: -1,
        })
        .toPromise();
      if (candidatesTab && candidatesTab.rows) {
        if (typeof candidatesTab.rows === 'string') {
          candidatesTab.rows = JSON.parse(candidatesTab.rows);
        }
      } else {
        return [];
      }

      const cands: CustodianInfo[] = [];
      candidatesTab.rows.forEach(cand => {
        cands.push({
          custodianName: cand.cust_name,
          requestedpay: cand.requestedpay,
          totalVotes: cand.total_votes,
        });
      });
      return cands;
    } catch (error) {
      throw new ApiException(
        getChainErorr(error),
        ApiMsgCode.CHAIN_GET_TABLE_ROWS_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  public async getCustodianConfig(dacId: string): Promise<CustodianConfig> {
    try {
      const custCinfigTab = await this.chainService
        .getTableRows({
          json: true,
          code: this.configService.getLocalConfig().get('custodiancontract'),
          scope: toChainEntityName(dacId),
          table: toChainEntityName('config'),
        })
        .toPromise();
      if (custCinfigTab && custCinfigTab.rows) {
        if (typeof custCinfigTab.rows === 'string') {
          custCinfigTab.rows = JSON.parse(custCinfigTab.rows);
        }
      } else {
        throw new ApiException(
          getChainErorr(Error(`Can not fund custodian config ${dacId}`)),
          ApiMsgCode.CHAIN_GET_TABLE_ROWS_FAILED,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return {
        lockupasset: custCinfigTab.rows[0].lockupasset,
        maxvotes: custCinfigTab.rows[0].maxvotes,
        numelected: custCinfigTab.rows[0].numelected,
        periodlength: custCinfigTab.rows[0].periodlength,
        shouldPayViaServiceProvider:
          custCinfigTab.rows[0].should_pay_viaService_provider,
        initialVoteQuorumPercent:
          custCinfigTab.rows[0].initial_vote_quorum_percent,
        voteQuorumPercent: custCinfigTab.rows[0].vote_quorum_percent,
        authThresholdHigh: custCinfigTab.rows[0].auth_threshold_high,
        authThresholdMid: custCinfigTab.rows[0].auth_threshold_high,
        authThresholdLow: custCinfigTab.rows[0].auth_threshold_high,
        lockupReleaseTimeDelay: custCinfigTab.rows[0].lockup_release_time_delay,
        requestedPayMax: custCinfigTab.rows[0].requested_pay_max,
      };
    } catch (error) {
      throw new ApiException(
        getChainErorr(error),
        ApiMsgCode.CHAIN_GET_TABLE_ROWS_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Normal interface
  public async newacct(
    req: NewAcctDto | Array<NewAcctDto>,
  ): Promise<ResponseAllDto> {
    try {
      let actions: Array<Action> = [];
      if (Array.isArray(req)) {
        actions = req.map(data =>
          this.actionsHelperService.makeNewacct(data.name),
        );
      } else {
        actions = [this.actionsHelperService.makeNewacct(req.name)];
      }
      const res = await this.chainService
        .transact(new TransactDto(actions))
        .toPromise();
      const resp: ResponseAllDto = { transactionId: res.transactionId };
      return resp;
    } catch (error) {
      throw new ApiException(
        getChainErorr(error),
        ApiMsgCode.CHAIN_UNIVERSAL_NEWACCT_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  public async xtransfer(
    req: XtansferInfo | Array<XtansferInfo>,
  ): Promise<ResponseAllDto> {
    try {
      console.log('req:', req);
      let actions: Array<Action> = [];
      if (Array.isArray(req)) {
        actions = req.map(xtr =>
          this.actionsHelperService.makeXtransfer(
            xtr.from,
            xtr.to,
            xtr.foQuantity,
            xtr.memo,
          ),
        );
      } else {
        actions.push(
          this.actionsHelperService.makeXtransfer(
            req.from,
            req.to,
            req.foQuantity,
            req.memo,
          ),
        );
      }
      const res = await this.chainService
        .transact(new TransactDto(actions))
        .toPromise();

      const resp: ResponseAllDto = { transactionId: res.transactionId };
      return resp;
    } catch (error) {
      throw new ApiException(
        getChainErorr(error),
        ApiMsgCode.CHAIN_UNIVERSAL_XTRANSFER_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  public async treasuryxfer(
    req: TreasuryxferInfo | Array<TreasuryxferInfo>,
  ): Promise<ResponseAllDto> {
    try {
      const actions: Array<Action> = [];
      if (Array.isArray(req)) {
        console.log('req:', req);
        for (let i = 0; i < req.length; i++) {
          const treasury = (
            await this.configService.getDir(req[i].dacId)
          ).getAccount(ACCT_TYPE.ACCOUNT_TREASURY);
          actions.push(
            this.actionsHelperService.makeTreasuryxfer(
              treasury,
              req[i].to,
              req[i].foQuantity,
              req[i].memo,
            ),
          );
        }
      } else {
        const treasury = (
          await this.configService.getDir(req.dacId)
        ).getAccount(ACCT_TYPE.ACCOUNT_TREASURY);
        actions.push(
          this.actionsHelperService.makeTreasuryxfer(
            treasury,
            req.to,
            req.foQuantity,
            req.memo,
          ),
        );
      }

      const res = await this.chainService
        .transact(new TransactDto(actions))
        .toPromise();

      const resp: ResponseAllDto = { transactionId: res.transactionId };
      return resp;
    } catch (error) {
      throw new ApiException(
        getChainErorr(error),
        ApiMsgCode.CHAIN_UNIVERSAL_TREASURY_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  public async getBalance(req: BalanceDto): Promise<ResponseBalanceDto> {
    try {
      return this.chainService.getBalance(req).toPromise();
    } catch (error) {
      throw new ApiException(
        getChainErorr(error),
        ApiMsgCode.CHAIN_UNIVERSAL_GETBALANCE_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  public async callAction(req: CallActionDto): Promise<ResponseAllDto> {
    try {
      const actions: Array<Action> = [
        this.actionsHelperService.makeCallAction(
          req.code,
          req.funcName,
          req.paramStr,
          req.delimiter,
        ),
      ];
      const res = await this.chainService
        .transact(new TransactDto(actions))
        .toPromise();
      const resp: ResponseAllDto = { transactionId: res.transactionId };
      return resp;
    } catch (error) {
      throw new ApiException(
        getChainErorr(error),
        ApiMsgCode.CHAIN_UNIVERSAL_CALL_ACTION_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  public async logRecord(req: LogRecordDto): Promise<ResponseAllDto> {
    try {
      const actions: Array<Action> = [
        this.actionsHelperService.makeLogRecord(req.paramStr, req.delimiter),
      ];
      const res = await this.chainService
        .transact(new TransactDto(actions))
        .toPromise();
      const resp: ResponseAllDto = { transactionId: res.transactionId };
      return resp;
    } catch (error) {
      throw new ApiException(
        getChainErorr(error),
        ApiMsgCode.CHAIN_UNIVERSAL_LOGRECORD_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //DAC interface
  public async createBaseDAC(req: BaseDacInfo): Promise<ResponseAllDto> {
    try {
      const zeroDacAsset = {
        contract: toChainEntityName(
          this.configService.getLocalConfig().get('coreDacTokenContract'),
        ),
        quantity: toChainAssetFromSymbolCode(
          '0.0000',
          asset(req.maxSupply)
            .symbol.code()
            .toString(),
        ),
      };
      const actions: Array<Action> = [
        ...this.actionsHelperService.makeCreateDacAccts(
          req.authority,
          req.treasury,
        ),
        ...this.actionsHelperService.makeDAC(
          req.dacId,
          [req.dacCreator],
          req.authority,
          req.treasury,
          req.maxSupply,
          req.issuance,
          req.title,
          {
            lockupasset: zeroDacAsset,
            maxvotes: 1,
            numelected: 1,
            periodlength: 0,
            should_pay_via_service_provider: false,
            initial_vote_quorum_percent: 0,
            vote_quorum_percent: 0,
            auth_threshold_high: 1,
            auth_threshold_mid: 1,
            auth_threshold_low: 1,
            lockup_release_time_delay: 1233,
            requested_pay_max: zeroDacAsset,
          },
          req.refs,
        ),
      ];
      const res = await this.chainService
        .transact(new TransactDto(actions))
        .toPromise();
      const resp: ResponseAllDto = { transactionId: res.transactionId };
      return resp;
    } catch (error) {
      throw new ApiException(
        getChainErorr(error),
        ApiMsgCode.CAHIN_DAC_CREATE_BASEDAC_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  public async createPremiumDAC(req: PremiumDacInfo): Promise<ResponseAllDto> {
    try {
      const zeroDacAsset = {
        contract: req.dacAsset.contract,
        quantity: toChainAssetFromSymbolCode(
          '0.0000',
          asset(req.dacAsset.quantity)
            .symbol.code()
            .toString(),
        ),
      };
      const dexAcct: ChainEntityName = toChainEntityName(
        this.configService.getLocalConfig().get('dexcontract'),
      );
      const actions: Array<Action> = [
        ...this.actionsHelperService.makeCreateDacAccts(
          req.authority,
          req.treasury,
          // req.maxSupply,
          // req.issuance,
        ),
        ...this.actionsHelperService.makeDAC(
          req.dacId,
          [req.dacCreator],
          req.authority,
          req.treasury,
          req.maxSupply,
          req.issuance,
          req.title,
          {
            lockupasset: zeroDacAsset,
            maxvotes: 1,
            numelected: 1,
            periodlength: 0,
            should_pay_via_service_provider: false,
            initial_vote_quorum_percent: 0,
            vote_quorum_percent: 0,
            auth_threshold_high: 1,
            auth_threshold_mid: 1,
            auth_threshold_low: 1,
            lockup_release_time_delay: 1233,
            requested_pay_max: zeroDacAsset,
          },
          req.refs,
        ),
        ...this.actionsHelperService.makeCreatePairToken(
          req.dacCreator,
          req.treasury,
          req.pairToken,
          dexAcct,
          req.coreAsset,
          req.dacAsset,
        ),
      ];
      const res = await this.chainService
        .transact(new TransactDto(actions))
        .toPromise();
      const resp: ResponseAllDto = { transactionId: res.transactionId };
      return resp;
    } catch (error) {
      throw new ApiException(
        getChainErorr(error),
        ApiMsgCode.CAHIN_DAC_CREATE_PREMIUMDAC_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  public async createCustomDAC(req: CustomDacInfo): Promise<ResponseAllDto> {
    try {
      const dexAcct: ChainEntityName = toChainEntityName(
        this.configService.getLocalConfig().get('dexcontract'),
      );
      const refs: Array<{ key: number; value: string }> = req.refs
        ? req.refs
        : [];
      const actions: Array<Action> = [
        ...this.actionsHelperService.makeCreateDacAccts(
          req.authority,
          req.treasury,
          // req.maxSupply,
          // req.issuance,
        ),
        ...this.actionsHelperService.makeDAC(
          req.dacId,
          req.appointedCustodians,
          req.authority,
          req.treasury,
          req.maxSupply,
          req.issuance,
          req.title,
          this.makeCustConfig(
            req.numelected,
            toChainSymbolCode(
              asset(req.dacAsset.quantity)
                .symbol.code()
                .toString(),
            ),
            req.periodlength,
          ),
          refs,
        ),
        ...this.actionsHelperService.makeCreatePairToken(
          req.dacCreator,
          req.treasury,
          req.pairToken,
          dexAcct,
          req.coreAsset,
          req.dacAsset,
        ),
      ];
      const res = await this.chainService
        .transact(new TransactDto(actions))
        .toPromise();
      const resp: ResponseAllDto = { transactionId: res.transactionId };
      return resp;
    } catch (error) {
      throw new ApiException(
        getChainErorr(error),
        ApiMsgCode.CAHIN_DAC_CREATE_CUSTOMDAC_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  // public async upgrade2Cust(): Promise<ResponseAllDto> {}
  public async upgrade2Premium(
    req: Upgrade2PremiumInfo,
  ): Promise<ResponseAllDto> {
    try {
      const dexAcct: ChainEntityName = toChainEntityName(
        this.configService.getLocalConfig().get('dexcontract'),
      );
      const actions: Array<Action> = [
        ...this.actionsHelperService.makeCreatePairToken(
          req.coreTokenOffer,
          req.treasury,
          req.pairToken,
          dexAcct,
          req.coreAsset,
          req.dacAsset,
        ),
      ];
      const res = await this.chainService
        .transact(new TransactDto(actions))
        .toPromise();
      const resp: ResponseAllDto = { transactionId: res.transactionId };
      return resp;
    } catch (error) {
      throw new ApiException(
        getChainErorr(error),
        ApiMsgCode.CAHIN_DAC_UPGRADE2PREMIUM_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  // destoryDAC;

  public async voteAction(req: VoteDto): Promise<ResponseAllDto> {
    try {
      const actions: Array<Action> = [
        this.actionsHelperService.makeVoteAction(
          req.name,
          req.votes,
          req.dacId,
        ),
      ];
      const res = await this.chainService
        .transact(new TransactDto(actions))
        .toPromise();
      const resp: ResponseAllDto = { transactionId: res.transactionId };
      return resp;
    } catch (error) {
      throw new ApiException(
        getChainErorr(error),
        ApiMsgCode.CAHIN_DAC_VOTE_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  public async proposeMsig(propReq: ProposeDto): Promise<ResponseAllDto> {
    try {
      // const trxData = new TransactionDto(
      //   propReq.actions,
      //   new Date(new Date().getTime() + this.configService.getLocalConfig().get('expirationInterval'))
      //     .toISOString()
      //     .split('.')[0],
      // );
      await Promise.all(
        propReq.actions.map(async (action, idx) => {
          propReq.actions[idx].data = await this.serializeActionData(action);
        }),
      );
      const actions: Array<Action> = [
        this.actionsHelperService.makePropose(
          propReq.proposer,
          propReq.propsalName,
          propReq.requested,
          propReq.expiration,
          propReq.actions,
        ),
        this.actionsHelperService.makeProposed(
          propReq.dacId,
          propReq.proposer,
          propReq.propsalName,
          propReq.title,
          propReq.description,
        ),
      ];
      const trx = new TransactDto(actions);
      trx.delaySec = propReq.delaySec || 0;
      const res = await this.chainService.transact(trx).toPromise();
      const resp: ResponseAllDto = { transactionId: res.transactionId };
      return resp;
    } catch (error) {
      throw new ApiException(
        getChainErorr(error),
        ApiMsgCode.CHAIN_DAC_PROPOSEMSIG_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  public async propchangeCustParams(
    req: PropChangeCustParams,
  ): Promise<ResponseAllDto> {
    try {
      const dacauthority = (
        await this.configService.getDir(req.dacId)
      ).getAccount(ACCT_TYPE.ACCOUNT_TREASURY);
      const symbolCode = toChainSymbolCode(
        (await this.configService.getDir(req.dacId)).getSymbolCode(),
      );
      const latestCustCfg = await this.getCustodianConfig(req.dacId);
      const actions: Array<Action> = [
        {
          account: toChainEntityName(
            this.configService.getLocalConfig().get('acctsmanager'),
          ),
          name: toChainEntityName('updateconfig'),
          authorization: [
            {
              actor: toChainEntityName(dacauthority),
              permission: toChainEntityName('active'),
            },
          ],
          data: {
            new_config: this.makeCustConfig(
              req.numelected,
              toChainSymbolCode(symbolCode),
              // TODO: should get the latest periodlength
              latestCustCfg.periodlength,
            ),
            dac_id: req.dacId,
          },
        },
      ];
      const propsalName = this.randomName();
      const requested = await this.getCustodianPermissions(
        req.dacId,
        latestCustCfg.numelected,
      );
      const proposeReq: ProposeDto = {
        dacId: req.dacId,
        title: req.title,
        description: req.description,
        expiration:
          req.expiration ||
          toChainDate(
            new Date(
              new Date().getTime() +
                this.configService.getLocalConfig().get('expirationInterval'),
            ),
          ),
        proposer: req.proposer,
        propsalName: propsalName,
        requested: requested,
        actions: actions,
      };

      return await this.proposeMsig(proposeReq);
    } catch (error) {
      throw new ApiException(
        getChainErorr(error),
        ApiMsgCode.CHAIN_DAC_PROP_CHANGE_CUST_NUM_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  public async propTransfer(req: PropTransferInfo): Promise<ResponseAllDto> {
    try {
      const latestCustCfg = await this.getCustodianConfig(req.dacId);

      const dactreasury = (
        await this.configService.getDir(req.dacId)
      ).getAccount(ACCT_TYPE.ACCOUNT_TREASURY);
      const auth = {
        actor: dactreasury,
        permission: toChainEntityName('xfer'),
      };
      const actions: Array<Action> = [
        {
          account: this.configService.getLocalConfig().get('acctsmanager'),
          name: toChainEntityName('treasuryxfer'),
          authorization: [auth],
          data: {
            from: dactreasury,
            to: req.actionData.to,
            fo_quantity: req.actionData.foQuantity,
            memo: req.actionData.memo,
          },
        },
      ];
      const proposeReq: ProposeDto = {
        dacId: req.dacId,
        title: req.title,
        description: req.description,
        expiration:
          req.expiration ||
          toChainDate(
            new Date(
              new Date().getTime() +
                this.configService.getLocalConfig().get('expirationInterval'),
            ),
          ),
        proposer: req.proposer,
        propsalName: this.randomName(),
        requested: await this.getCustodianPermissions(
          req.dacId,
          latestCustCfg.numelected,
        ),
        actions: actions,
      };
      return await this.proposeMsig(proposeReq);
    } catch (error) {
      throw new ApiException(
        getChainErorr(error),
        ApiMsgCode.CHAIN_DAC_PROP_TRANSFER_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  public async approveProposal(approveReq: OperationProposalDto) {
    try {
      const actions: Array<Action> = [
        this.actionsHelperService.makeApprove(
          approveReq.proposer,
          approveReq.propsalName,
          approveReq.name,
        ),
        this.actionsHelperService.makeApproved(
          approveReq.dacId,
          approveReq.proposer,
          approveReq.propsalName,
          approveReq.name,
        ),
      ];
      const res = await this.chainService
        .transact(new TransactDto(actions))
        .toPromise();
      const resp: ResponseAllDto = { transactionId: res.transactionId };
      return resp;
    } catch (error) {
      throw new ApiException(
        getChainErorr(error),
        ApiMsgCode.CHAIN_DAC_APPROVEPROP_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  public async unapproveProposal(unapproveReq: OperationProposalDto) {
    try {
      const actions: Array<Action> = [
        this.actionsHelperService.makeUnapprove(
          unapproveReq.proposer,
          unapproveReq.propsalName,
          unapproveReq.name,
        ),
        this.actionsHelperService.makeUnapproved(
          unapproveReq.dacId,
          unapproveReq.proposer,
          unapproveReq.propsalName,
          unapproveReq.name,
        ),
      ];
      const res = await this.chainService
        .transact(new TransactDto(actions))
        .toPromise();
      const resp: ResponseAllDto = { transactionId: res.transactionId };
      return resp;
    } catch (error) {
      throw new ApiException(
        getChainErorr(error),
        ApiMsgCode.CHAIN_DAC_UNAPPROVEPROP_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  public async disapproveProposal(disapproveReq: OperationProposalDto) {
    try {
      const actions: Array<Action> = [
        this.actionsHelperService.makeDeny(
          disapproveReq.dacId,
          disapproveReq.proposer,
          disapproveReq.propsalName,
          disapproveReq.name,
        ),
      ];
      const res = await this.chainService
        .transact(new TransactDto(actions))
        .toPromise();
      const resp: ResponseAllDto = { transactionId: res.transactionId };
      return resp;
    } catch (error) {
      throw new ApiException(
        getChainErorr(error),
        ApiMsgCode.CHAIN_DAC_UNAPPROVEPROP_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  public async executeProposal(executeReq: OperationProposalDto) {
    try {
      const actions: Array<Action> = [
        this.actionsHelperService.makeExec(
          executeReq.proposer,
          executeReq.propsalName,
          executeReq.name,
        ),
        this.actionsHelperService.makeExecuted(
          executeReq.dacId,
          executeReq.proposer,
          executeReq.propsalName,
          executeReq.name,
        ),
      ];
      const res = await this.chainService
        .transact(new TransactDto(actions))
        .toPromise();
      const resp: ResponseAllDto = { transactionId: res.transactionId };
      return resp;
    } catch (error) {
      throw new ApiException(
        getChainErorr(error),
        ApiMsgCode.CHAIN_DAC_EXECUTEPROP_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  public async cancelProposal(cancelReq: OperationProposalDto) {
    try {
      const actions: Array<Action> = [
        this.actionsHelperService.makeCancel(
          cancelReq.proposer,
          cancelReq.propsalName,
          cancelReq.name,
        ),
        this.actionsHelperService.makeCancelled(
          cancelReq.dacId,
          cancelReq.proposer,
          cancelReq.propsalName,
          cancelReq.name,
        ),
      ];
      const res = await this.chainService
        .transact(new TransactDto(actions))
        .toPromise();
      const resp: ResponseAllDto = { transactionId: res.transactionId };
      return resp;
    } catch (error) {
      throw new ApiException(
        getChainErorr(error),
        ApiMsgCode.CHAIN_DAC_CANCELPROP_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  public async publish(
    callactiontReq: CallActionDto,
    propReq: ProposeDto,
  ): Promise<ResponseAllDto> {
    try {
      await Promise.all(
        propReq.actions.map(async (action, idx) => {
          propReq.actions[idx].data = await this.serializeActionData(action);
        }),
      );

      const actions: Array<Action> = [
        this.actionsHelperService.makeCallAction(
          callactiontReq.code,
          callactiontReq.funcName,
          callactiontReq.paramStr,
          callactiontReq.delimiter,
        ),
        this.actionsHelperService.makePropose(
          propReq.proposer,
          propReq.propsalName,
          propReq.requested,
          propReq.expiration,
          propReq.actions,
        ),
        this.actionsHelperService.makeProposed(
          propReq.dacId,
          propReq.proposer,
          propReq.propsalName,
          propReq.title,
          propReq.description,
        ),
      ];
      const res = await this.chainService
        .transact(new TransactDto(actions))
        .toPromise();
      const resp: ResponseAllDto = { transactionId: res.transactionId };
      return resp;
    } catch (error) {
      throw new ApiException(
        getChainErorr(error),
        ApiMsgCode.CHAIN_DAC_PUBLISH_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  public async memberreg(req: MemberregInfo): Promise<ResponseAllDto> {
    try {
      const delimiter = '-';
      const paramStr =
        req.sender +
        delimiter +
        this.configService.getLocalConfig().get('hashData') +
        delimiter +
        req.dacId;

      const actions: Array<Action> = [
        this.actionsHelperService.makeCallAction(
          this.configService.getLocalConfig().get('dactokencontract'),
          toChainEntityName('memberreg'),
          paramStr,
          delimiter,
        ),
      ];
      const res = await this.chainService
        .transact(new TransactDto(actions))
        .toPromise();
      const resp: ResponseAllDto = { transactionId: res.transactionId };
      return resp;
    } catch (error) {
      throw new ApiException(
        getChainErorr(error),
        ApiMsgCode.CHAIN_DAC_MEMBERREG_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  public async memberunreg(req: MemberunregInfo): Promise<ResponseAllDto> {
    try {
      const delimiter = '-';
      const paramStr = req.sender + delimiter + req.dacId;

      const actions: Array<Action> = [
        this.actionsHelperService.makeCallAction(
          this.configService.getLocalConfig().get('dactokencontract'),
          toChainEntityName('memberunreg'),
          paramStr,
          delimiter,
        ),
      ];
      const res = await this.chainService
        .transact(new TransactDto(actions))
        .toPromise();
      const resp: ResponseAllDto = { transactionId: res.transactionId };
      return resp;
    } catch (error) {
      throw new ApiException(
        getChainErorr(error),
        ApiMsgCode.CHAIN_DAC_MEMBERUNREG_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  public async stake(req: StakeInfo): Promise<ResponseAllDto> {
    try {
      const delimiter = '-';
      const paramStr =
        req.owner +
        delimiter +
        req.foQuantity.quantity +
        delimiter +
        req.foQuantity.contract;

      const actions: Array<Action> = [
        this.actionsHelperService.makeCallAction(
          this.configService.getLocalConfig().get('dividendcontract'),
          toChainEntityName('stake'),
          paramStr,
          delimiter,
        ),
      ];
      const res = await this.chainService
        .transact(new TransactDto(actions))
        .toPromise();
      const resp: ResponseAllDto = { transactionId: res.transactionId };
      return resp;
    } catch (error) {
      throw new ApiException(
        getChainErorr(error),
        ApiMsgCode.CHAIN_DAC_STAKE_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  public async unstake(req: StakeInfo): Promise<ResponseAllDto> {
    try {
      const delimiter = '-';
      const paramStr =
        req.owner +
        delimiter +
        req.foQuantity.quantity +
        delimiter +
        req.foQuantity.contract;

      const actions: Array<Action> = [
        this.actionsHelperService.makeCallAction(
          this.configService.getLocalConfig().get('dividendcontract'),
          toChainEntityName('unstake'),
          paramStr,
          delimiter,
        ),
      ];
      const res = await this.chainService
        .transact(new TransactDto(actions))
        .toPromise();
      const resp: ResponseAllDto = { transactionId: res.transactionId };
      return resp;
    } catch (error) {
      throw new ApiException(
        getChainErorr(error),
        ApiMsgCode.CHAIN_DAC_UNSTAKE_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  public async nominatecand(req: NominatecandInfo): Promise<ResponseAllDto> {
    try {
      const delimiter = '-';
      const paramStr =
        req.sender +
        delimiter +
        toChainAssetFromSymbolCode(
          '0.0000',
          (await this.configService.getDir(req.dacId)).getSymbolCode(),
        ) +
        delimiter +
        req.dacId;

      const actions: Array<Action> = [
        this.actionsHelperService.makeCallAction(
          this.configService.getLocalConfig().get('custodiancontract'),
          toChainEntityName('nominatecand'),
          paramStr,
          delimiter,
        ),
      ];
      const res = await this.chainService
        .transact(new TransactDto(actions))
        .toPromise();
      const resp: ResponseAllDto = { transactionId: res.transactionId };
      return resp;
    } catch (error) {
      throw new ApiException(
        getChainErorr(error),
        ApiMsgCode.CHAIN_DAC_NOMINATECAND_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  public async withdrawcand(req: NominatecandInfo): Promise<ResponseAllDto> {
    try {
      const delimiter = '-';
      const paramStr = req.sender + delimiter + req.dacId;

      const actions: Array<Action> = [
        this.actionsHelperService.makeCallAction(
          this.configService.getLocalConfig().get('custodiancontract'),
          toChainEntityName('withdrawcand'),
          paramStr,
          delimiter,
        ),
      ];
      const res = await this.chainService
        .transact(new TransactDto(actions))
        .toPromise();
      const resp: ResponseAllDto = { transactionId: res.transactionId };
      return resp;
    } catch (error) {
      throw new ApiException(
        getChainErorr(error),
        ApiMsgCode.CHAIN_DAC_WITHDRWCAND_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  public async joinDac(req: NominatecandInfo): Promise<ResponseAllDto> {
    try {
      const delimiter = '-';

      const memberRegparamStr =
        req.sender +
        delimiter +
        this.configService.getLocalConfig().get('hashData') +
        delimiter +
        req.dacId;

      const nominatecandParamStr =
        req.sender +
        delimiter +
        toChainAssetFromSymbolCode(
          '0.0000',
          (await this.configService.getDir(req.dacId)).getSymbolCode(),
        ) +
        delimiter +
        req.dacId;

      const actions: Array<Action> = [
        this.actionsHelperService.makeCallAction(
          this.configService.getLocalConfig().get('dactokencontract'),
          toChainEntityName('memberreg'),
          memberRegparamStr,
          delimiter,
        ),
        this.actionsHelperService.makeCallAction(
          this.configService.getLocalConfig().get('custodiancontract'),
          toChainEntityName('nominatecand'),
          nominatecandParamStr,
          delimiter,
        ),
      ];

      const res = await this.chainService
        .transact(new TransactDto(actions))
        .toPromise();
      const resp: ResponseAllDto = { transactionId: res.transactionId };
      return resp;
    } catch (error) {
      throw new ApiException(
        getChainErorr(error),
        ApiMsgCode.CHAIN_DAC_NOMINATECAND_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Exchange interface
  public async closePairToken(req: ClosePairTokenDto): Promise<ResponseAllDto> {
    // closeext1
    //closeext2
    //remliquidity
    try {
      const actions: Array<Action> = [
        this.actionsHelperService.makeCloseext(req.user, req.extSymbol1),
        this.actionsHelperService.makeCloseext(req.user, req.extSymbol2),
        this.actionsHelperService.makeRemliquidity(
          req.user,
          toChainAsset('1', req.extSymbol1.symbol),
          toChainAsset('1', req.extSymbol2.symbol),
        ),
      ];
      const res = await this.chainService
        .transact(new TransactDto(actions))
        .toPromise();
      const resp: ResponseAllDto = { transactionId: res.transactionId };
      return resp;
    } catch (error) {
      throw new ApiException(
        getChainErorr(error),
        ApiMsgCode.CHAIN_EXCH_CLOSE_PAIRTOKEN_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  public async withdraw(user: ChainEntityName): Promise<ResponseAllDto> {
    try {
      // const custCinfigTab = await this.chainService
      //   .getTableRows({
      //     json: true,
      //     code: toChainEntityName(
      //       this.configService.getLocalConfig().get('dexcontract'),
      //     ),
      //     scope: this.sysId,
      //     table: toChainEntityName('config'),
      //   })
      //   .toPromise();

      // if (custCinfigTab && custCinfigTab.rows) {
      //   if (typeof custCinfigTab.rows === 'string') {
      //     custCinfigTab.rows = JSON.parse(custCinfigTab.rows);
      //   }
      // } else {
      //   throw new ApiException(
      //     getChainErorr(Error('Can not fund rows data')),
      //     ApiMsgCode.CHAIN_EXCH_WITHDRAW_FAILED,
      //     HttpStatus.INTERNAL_SERVER_ERROR,
      //   );
      // }
      // TODO: fake data
      const extendedAsset: ExtendedAssetDto = {
        contract: toChainEntityName('eosio.token'),
        quantity: toChainAssetFromSymbolCode('1.0000', 'EOS'),
      };
      const actions: Array<Action> = [
        this.actionsHelperService.makeWithdraw(user, extendedAsset),
        this.actionsHelperService.makeClose(
          user,
          toChainSymbol(extendedAsset.quantity),
        ),
      ];
      const res = await this.chainService
        .transact(new TransactDto(actions))
        .toPromise();
      const resp: ResponseAllDto = { transactionId: res.transactionId };
      return resp;
    } catch (error) {
      throw new ApiException(
        getChainErorr(error),
        ApiMsgCode.CHAIN_EXCH_WITHDRAW_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  public async exchange(exchangeInfo: ExchangeDto): Promise<ResponseAllDto> {
    try {
      const actions: Array<Action> = [
        this.actionsHelperService.makeExchange(
          exchangeInfo.user,
          exchangeInfo.pairToken,
          exchangeInfo.extAssetIn,
          exchangeInfo.minExpected,
        ),
      ];
      const res = await this.chainService
        .transact(new TransactDto(actions))
        .toPromise();
      const resp: ResponseAllDto = { transactionId: res.transactionId };
      return resp;
    } catch (error) {
      throw new ApiException(
        getChainErorr(error),
        ApiMsgCode.CHAIN_EXCH_EXCHANGE_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  public async exchangev2(
    exchangeInfo: ExchangeV2Dto,
  ): Promise<ResponseAllDto> {
    try {
      const actions: Array<Action> = [
        this.actionsHelperService.makeExchangeV2(
          exchangeInfo.user,
          exchangeInfo.pairToken1,
          exchangeInfo.pairToken2,
          exchangeInfo.extAssetIn,
          exchangeInfo.minExpected,
        ),
      ];
      const res = await this.chainService
        .transact(new TransactDto(actions))
        .toPromise();
      const resp: ResponseAllDto = { transactionId: res.transactionId };
      return resp;
    } catch (error) {
      throw new ApiException(
        getChainErorr(error),
        ApiMsgCode.CHAIN_EXCH_EXCHANGEV2_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  public async cancelContract(req: CancelContractInfo): Promise<ResponseAllDto> {
    try {
      const delimiter = '-';
      const paramStr = req.contractId + delimiter + req.canceler;
      const actions: Array<Action> = [
        this.actionsHelperService.makeCallAction(
          this.configService.getLocalConfig().get('makecontract'),
          toChainEntityName('cancelcontr'),
          paramStr,
          delimiter,
        ),
      ];
      const res = await this.chainService
        .transact(new TransactDto(actions))
        .toPromise();
      const resp: ResponseAllDto = { transactionId: res.transactionId };
      return resp;
    } catch (error) {
      throw new ApiException(
        getChainErorr(error),
        ApiMsgCode.CHAIN_DAC_WITHDRWCAND_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  public async acceptContract(req: AcceptContractInfo): Promise<ResponseAllDto> {
    try {
      const delimiter = '-';
      const paramStr = req.contractId + delimiter + req.accepter;
      const actions: Array<Action> = [
        this.actionsHelperService.makeCallAction(
          this.configService.getLocalConfig().get('makecontract'),
          toChainEntityName('acceptcontr'),
          paramStr,
          delimiter,
        ),
      ];
      const res = await this.chainService
        .transact(new TransactDto(actions))
        .toPromise();
      const resp: ResponseAllDto = { transactionId: res.transactionId };
      return resp;
    } catch (error) {
      throw new ApiException(
        getChainErorr(error),
        ApiMsgCode.CHAIN_DAC_WITHDRWCAND_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  public async approvedContract(req: ApproveContractInfo): Promise<ResponseAllDto> {
    try {
      const delimiter = '-';
      const paramStr = req.contractId + delimiter + req.approver;
      const actions: Array<Action> = [
        this.actionsHelperService.makeCallAction(
          this.configService.getLocalConfig().get('makecontract'),
          toChainEntityName('approved'),
          paramStr,
          delimiter,
        ),
      ];
      const res = await this.chainService
        .transact(new TransactDto(actions))
        .toPromise();
      const resp: ResponseAllDto = { transactionId: res.transactionId };
      return resp;
    } catch (error) {
      throw new ApiException(
        getChainErorr(error),
        ApiMsgCode.CHAIN_DAC_WITHDRWCAND_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  public async payContract(req: PayContractInfo): Promise<ResponseAllDto> {
    try {
      const delimiter = '-';
      const paramStr = req.contractId + delimiter + req.payer + delimiter +
        req.payment.quantity +
        delimiter +
        req.payment.contract;
      const actions: Array<Action> = [
        this.actionsHelperService.makeCallAction(
          this.configService.getLocalConfig().get('makecontract'),
          toChainEntityName('pay'),
          paramStr,
          delimiter,
        ),
      ];
      const res = await this.chainService
        .transact(new TransactDto(actions))
        .toPromise();
      const resp: ResponseAllDto = { transactionId: res.transactionId };
      return resp;
    } catch (error) {
      throw new ApiException(
        getChainErorr(error),
        ApiMsgCode.CHAIN_DAC_WITHDRWCAND_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  public async burn(req: BurnContractInfo): Promise<ResponseAllDto> {
    try {
      console.log('req:', req);
      let actions: Array<Action> = [];

      actions.push(
        this.actionsHelperService.makeBurnContract(
          req.beBurner,
          req.quantity,
        ),
      );
      const res = await this.chainService
        .transact(new TransactDto(actions))
        .toPromise();

      const resp: ResponseAllDto = { transactionId: res.transactionId };
      return resp;
    } catch (error) {
      throw new ApiException(
        getChainErorr(error),
        ApiMsgCode.CHAIN_UNIVERSAL_XTRANSFER_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  public async createContract(
    req: CreateContractInfo
  ): Promise<ResponseAllDto> {
    try {
      console.log('req:', req);
      let actions: Array<Action> = [];

      actions.push(
        this.actionsHelperService.makeCreateContract(
          req.contractId,
          req.partyA,
          req.partyB,
          req.title,
          req.content,
          req.contentHash,
          req.contractPay
        ),
      );
      const res = await this.chainService
        .transact(new TransactDto(actions))
        .toPromise();

      const resp: ResponseAllDto = { transactionId: res.transactionId };
      return resp;
    } catch (error) {
      throw new ApiException(
        getChainErorr(error),
        ApiMsgCode.CHAIN_UNIVERSAL_XTRANSFER_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
