/* eslint-disable @typescript-eslint/camelcase */
import { Injectable } from '@nestjs/common';
import {
  Action,
  ExtendedSymbolDto,
  ExtendedAssetDto,
  PermissionLevelDto,
  LinkAuthDto,
  UpdateAuthDto,
  AuthorityDto,
  DacConfigDto,
} from './dto';
import {
  ChainEntityName,
  ChainSymbol,
  ChainSymbolCode,
  ChainAsset,
  ChainDate,
} from './types';
import {
  toChainSymbol,
  toChainEntityName,
  toChainEntityNameOrEmptyString,
  toChainPrecision,
  toChainSymbolfromPrecision,
} from './utils';
import { ACCT_TYPE } from '../config/dacdirectory';
import { ConfigService } from '../config/config.service';
import { AssetsDto } from '../account/dto/resp/asset.dto';
const owner = toChainEntityName('owner');
const active = toChainEntityName('active');
const high = toChainEntityName('high');
const med = toChainEntityName('med');
const low = toChainEntityName('low');
const one = toChainEntityName('one');
const admin = toChainEntityName('admin');

//treasury
const xfer = toChainEntityName('xfer');
const escrow = toChainEntityName('escrow');

const code = toChainEntityName('eosio.code');

@Injectable()
export class ActionsHelperService {
  async onModuleInit(): Promise<void> {
    this.sysId = toChainEntityName(
      this.configService.getLocalConfig().get('sysDacId'),
    );
    this.acctsmanager = this.configService.getLocalConfig().get('acctsmanager');
  }
  private sysId = toChainEntityName('dacdac');
  private acctsmanager = toChainEntityName('acctsmanager');
  constructor(private readonly configService: ConfigService) {}

  // system
  public makeLinkAuth(
    authorizations: PermissionLevelDto[],
    linkAuthreq: LinkAuthDto,
  ): Action {
    return {
      account: this.acctsmanager,
      name: toChainEntityName('xlinkauth'),
      authorization: authorizations,
      data: JSON.stringify({
        account: linkAuthreq.account,
        code: linkAuthreq.code,
        type: linkAuthreq.type,
        requirement: linkAuthreq.requirement,
      }),
    };
  }
  public makeUpdateAuth(
    authorizations: PermissionLevelDto[],
    updateAuthReq: UpdateAuthDto,
  ): Action {
    return {
      account: this.acctsmanager,
      name: toChainEntityName('xupdateauth'),
      authorization: authorizations,
      data: JSON.stringify({
        account: updateAuthReq.account,
        permission: updateAuthReq.permission,
        parent: updateAuthReq.parent,
        auth: updateAuthReq.auth,
      }),
    };
  }
  //universal
  public makeNewacct(acctName: ChainEntityName): Action {
    return {
      account: this.acctsmanager,
      name: toChainEntityName('newacct'),
      authorization: [
        {
          actor: this.acctsmanager,
          permission: toChainEntityName('newacct'),
        },
      ],
      data: JSON.stringify({
        acct: acctName,
      }),
    };
  }
  public makeXtransfer(
    from: ChainEntityName,
    to: ChainEntityName,
    foQuantity: ExtendedAssetDto,
    memo: string,
  ): Action {
    return {
      account: this.acctsmanager,
      name: toChainEntityName('xtransfer'),
      authorization: [
        {
          actor: this.acctsmanager,
          permission: active,
        },
      ],
      data: JSON.stringify({
        from: from,
        to: to,
        fo_quantity: foQuantity,
        memo: memo,
      }),
    };
  }
  public makeCreateContract(
    contractId: ChainEntityName,
    partyA: ChainEntityName,
    partyB: ChainEntityName,
    title: string,
    content: string,
    contentHash: string,
    contract_pay: ExtendedAssetDto,
  ): Action {
    return {
      account: this.acctsmanager,
      name: toChainEntityName('createcontr'),
      authorization: [
        {
          actor: this.acctsmanager,
          permission: active,
        },
      ],
      data: JSON.stringify({
        id: contractId,
        party_a: partyA,
        party_b: partyB,
        title: title,
        summary: content,
        content_hash: contentHash,
        contract_pay: contract_pay
      }),
    };
  }
  public makeBurnContract(
    beBurner: ChainEntityName,
    quantity: ChainAsset,
  ): Action {
    return {
      account: this.acctsmanager,
      name: toChainEntityName('tokenburn'),
      authorization: [
        {
          actor: this.acctsmanager,
          permission: active,
        },
      ],
      data: JSON.stringify({
        from: beBurner,
        quantity: quantity,
      }),
    };
  }
  public makeTreasuryxfer(
    treasury: ChainEntityName,
    to: ChainEntityName,
    foQuantity: ExtendedAssetDto,
    memo: string,
  ): Action {
    return {
      account: this.acctsmanager,
      name: toChainEntityName('treasuryxfer'),
      authorization: [
        {
          actor: this.acctsmanager,
          permission: active,
        },
      ],
      data: JSON.stringify({
        from: treasury,
        to: to,
        fo_quantity: foQuantity,
        memo: memo,
      }),
    };
  }
  public makeCallAction(
    code: ChainEntityName,
    funcName: string,
    paramStr: string,
    delimiter: string,
  ): Action {
    return {
      account: this.acctsmanager,
      name: toChainEntityName('callaction'),
      authorization: [
        {
          actor: this.acctsmanager,
          permission: active,
        },
      ],
      data: JSON.stringify({
        code: code,
        func_name: funcName,
        paramstr: paramStr,
        delimiter: delimiter,
      }),
    };
  }
  public makeLogRecord(paramStr: string, delimiter: string): Action {
    return this.makeCallAction(
      toChainEntityName(
        this.configService.getLocalConfig().get('daclogrecord'),
      ),
      'logrecord',
      paramStr,
      delimiter,
    );
  }

  //DAC
  public makeVoteAction(
    name: ChainEntityName,
    votes: Array<string>,
    dacId: ChainEntityName,
  ): Action {
    return {
      account: this.acctsmanager,
      name: toChainEntityName('votecust'),
      authorization: [
        {
          actor: this.acctsmanager,
          permission: active,
        },
      ],
      data: JSON.stringify({
        voter: toChainEntityName(name),
        newvotes: votes,
        dac_id: toChainEntityName(dacId),
      }),
    };
  }
  public makePropose(
    proposer: ChainEntityName,
    propsalName: ChainEntityName,
    requested: Array<PermissionLevelDto>,
    expiration: ChainDate,
    actions: Array<Action>,
  ) {
    return {
      account: this.acctsmanager,
      name: toChainEntityName('propose'),
      authorization: [
        {
          actor: this.acctsmanager,
          permission: active,
        },
      ],
      data: JSON.stringify({
        proposer: proposer,
        proposal_name: propsalName,
        requested: requested,
        // 默认三天内超时
        trx: {
          expiration: expiration,
          ref_block_num: 0,
          ref_block_prefix: 0,
          max_net_usage_words: 0,
          max_cpu_usage_ms: 0,
          delay_sec: 0,
          context_free_actions: [],
          actions: actions,
          transaction_extensions: [],
        },
      }),
    };
  }
  public makeProposed(
    dacId: ChainEntityName,
    proposer: ChainEntityName,
    propsalName: ChainEntityName,
    title: string,
    description: string,
  ) {
    return {
      account: this.acctsmanager,
      name: toChainEntityName('proposed'),
      authorization: [
        {
          actor: this.acctsmanager,
          permission: active,
        },
      ],
      data: JSON.stringify({
        proposer: proposer,
        proposal_name: propsalName,
        metadata: JSON.stringify({
          title: title,
          description: description,
        }),
        dac_id: dacId,
      }),
    };
  }
  public makeApprove(
    proposer: ChainEntityName,
    propsalName: ChainEntityName,
    name: ChainEntityName,
  ) {
    return {
      account: this.acctsmanager,
      name: toChainEntityName('approve'),
      authorization: [
        {
          actor: this.acctsmanager,
          permission: active,
        },
      ],
      data: JSON.stringify({
        proposer: proposer,
        proposal_name: propsalName,
        level: {
          actor: name,
          permission: active,
        },
      }),
    };
  }
  public makeApproved(
    dacId: ChainEntityName,
    proposer: ChainEntityName,
    propsalName: ChainEntityName,
    name: ChainEntityName,
  ) {
    return {
      account: this.acctsmanager,
      name: toChainEntityName('approved'),
      authorization: [
        {
          actor: this.acctsmanager,
          permission: active,
        },
      ],
      data: JSON.stringify({
        proposer: proposer,
        proposal_name: propsalName,
        approver: name,
        dac_id: dacId,
      }),
    };
  }
  public makeDeny(
    dacId: ChainEntityName,
    proposer: ChainEntityName,
    propsalName: ChainEntityName,
    name: ChainEntityName,
  ) {
    return {
      account: this.acctsmanager,
      name: toChainEntityName('deny'),
      authorization: [
        {
          actor: this.acctsmanager,
          permission: active,
        },
      ],
      data: JSON.stringify({
        proposer: proposer,
        proposal_name: propsalName,
        denyer: name,
        dac_id: dacId,
      }),
    };
  }
  public makeUnapprove(
    proposer: ChainEntityName,
    propsalName: ChainEntityName,
    name: ChainEntityName,
  ) {
    return {
      account: this.acctsmanager,
      name: toChainEntityName('unapprove'),
      authorization: [
        {
          actor: this.acctsmanager,
          permission: active,
        },
      ],
      data: JSON.stringify({
        proposer: proposer,
        proposal_name: propsalName,
        level: {
          actor: name,
          permission: active,
        },
      }),
    };
  }
  public makeUnapproved(
    dacId: ChainEntityName,
    proposer: ChainEntityName,
    propsalName: ChainEntityName,
    name: ChainEntityName,
  ) {
    return {
      account: this.acctsmanager,
      name: toChainEntityName('unapproved'),
      authorization: [
        {
          actor: this.acctsmanager,
          permission: active,
        },
      ],
      data: JSON.stringify({
        proposer: proposer,
        proposal_name: propsalName,
        unapprover: name,
        dac_id: dacId,
      }),
    };
  }
  public makeExec(
    proposer: ChainEntityName,
    propsalName: ChainEntityName,
    name: ChainEntityName,
  ) {
    return {
      account: this.acctsmanager,
      name: toChainEntityName('exec'),
      authorization: [
        {
          actor: this.acctsmanager,
          permission: active,
        },
      ],
      data: JSON.stringify({
        proposer: proposer,
        proposal_name: propsalName,
        executer: name,
      }),
    };
  }
  public makeExecuted(
    dacId: ChainEntityName,
    proposer: ChainEntityName,
    propsalName: ChainEntityName,
    name: ChainEntityName,
  ) {
    return {
      account: this.acctsmanager,
      name: toChainEntityName('executed'),
      authorization: [
        {
          actor: this.acctsmanager,
          permission: active,
        },
      ],
      data: JSON.stringify({
        proposer: proposer,
        proposal_name: propsalName,
        executer: name,
        dac_id: dacId,
      }),
    };
  }
  public makeCancel(
    proposer: ChainEntityName,
    propsalName: ChainEntityName,
    name: ChainEntityName,
  ) {
    return {
      account: this.acctsmanager,
      name: toChainEntityName('cancel'),
      authorization: [
        {
          actor: this.acctsmanager,
          permission: active,
        },
      ],
      data: JSON.stringify({
        proposer: proposer,
        proposal_name: propsalName,
        canceler: name,
      }),
    };
  }
  public makeCancelled(
    dacId: ChainEntityName,
    proposer: ChainEntityName,
    propsalName: ChainEntityName,
    name: ChainEntityName,
  ) {
    return {
      account: this.acctsmanager,
      name: toChainEntityName('cancelled'),
      authorization: [
        {
          actor: this.acctsmanager,
          permission: active,
        },
      ],
      data: JSON.stringify({
        proposer: proposer,
        proposal_name: propsalName,
        canceler: name,
        dac_id: dacId,
      }),
    };
  }

  //exchange
  public makeOpenext(
    user: ChainEntityName,
    extendedSymbol: ExtendedSymbolDto,
  ): Action {
    return {
      account: this.acctsmanager,
      name: toChainEntityName('openext'),
      authorization: [
        {
          actor: this.acctsmanager,
          permission: active,
        },
      ],
      data: JSON.stringify({
        user: user,
        payer: user,
        ext_symbol: extendedSymbol,
      }),
    };
  }
  public makeCloseext(
    user: ChainEntityName,
    extendedSymbol: ExtendedSymbolDto,
  ): Action {
    return {
      account: this.acctsmanager,
      name: toChainEntityName('closeext'),
      authorization: [
        {
          actor: this.acctsmanager,
          permission: active,
        },
      ],
      data: JSON.stringify({
        user: user,
        to: user,
        ext_symbol: extendedSymbol,
        memo: `closePairToken ${extendedSymbol.symbol}`,
      }),
    };
  }
  public makeinitToken(
    user: ChainEntityName,
    symbol: ChainSymbol,
    coreExtAsset: ExtendedAssetDto,
    dacExtAsset: ExtendedAssetDto,
  ): Action {
    return {
      account: this.acctsmanager,
      name: toChainEntityName('inittoken'),
      authorization: [
        {
          actor: this.acctsmanager,
          permission: active,
        },
      ],
      data: JSON.stringify({
        user: user,
        new_symbol: symbol,
        initial_pool1: coreExtAsset,
        initial_pool2: dacExtAsset,
        initial_fee: 0,
        fee_contract: '',
      }),
    };
  }
  public makeRemliquidity(
    user: ChainEntityName,
    minAsset1: ChainAsset,
    minAsset2: ChainAsset,
  ): Action {
    return {
      account: this.acctsmanager,
      name: toChainEntityName('remliquidity'),
      authorization: [
        {
          actor: this.acctsmanager,
          permission: active,
        },
      ],
      data: JSON.stringify({
        user: user,
        min_asset1: minAsset1,
        min_asset2: minAsset2,
      }),
    };
  }
  public makeExchange(
    user: ChainEntityName,
    pairToken: ChainSymbolCode,
    extAssetIn: ExtendedAssetDto,
    minExpected: ChainAsset,
  ): Action {
    const dexAcct: ChainEntityName = toChainEntityName(
      this.configService.getLocalConfig().get('dexcontract'),
    );
    return this.makeXtransfer(
      user,
      dexAcct,
      extAssetIn,
      `exchange:${pairToken}:${minExpected}:constant exchange memo`,
    );
  }
  public makeExchangeV2(
    user: ChainEntityName,
    pairToken1: ChainSymbolCode,
    pairToken2: ChainSymbolCode,
    extAssetIn: ExtendedAssetDto,
    minExpected: ChainAsset,
  ): Action {
    const dexAcct: ChainEntityName = toChainEntityName(
      this.configService.getLocalConfig().get('dexcontract'),
    );
    return this.makeXtransfer(
      user,
      dexAcct,
      extAssetIn,
      `exchangev2:${pairToken1}:${pairToken2}:${minExpected}:constant exchangev2 memo`,
    );
  }
  public makeWithdraw(
    user: ChainEntityName,
    toWithdraw: ExtendedAssetDto,
  ): Action {
    return {
      account: this.acctsmanager,
      name: toChainEntityName('withdraw'),
      authorization: [
        {
          actor: this.acctsmanager,
          permission: active,
        },
      ],
      data: JSON.stringify({
        user: user,
        to: user,
        to_withdraw: toWithdraw,
        memo: `withdraw ${toWithdraw.quantity} from the exchange`,
      }),
    };
  }
  public makeClose(user: ChainEntityName, symbol: ChainSymbol): Action {
    return {
      account: this.acctsmanager,
      name: toChainEntityName('close'),
      authorization: [
        {
          actor: this.acctsmanager,
          permission: active,
        },
      ],
      data: JSON.stringify({
        owner: user,
        symbol: symbol,
      }),
    };
  }

  //DAC action
  public makeIniteDacAuths(
    authority: ChainEntityName,
    treasury: ChainEntityName,
  ): Array<Action> {
    return [
      ...this.makeCreateAuth(authority, treasury),
      // call the local func or smart contract action 'linkdacauth'
      // ...this.makeLinkAuthorityPermissions(authority, dactreasury),
      {
        account: this.acctsmanager,
        name: toChainEntityName('linkdacauth'),
        authorization: [
          {
            actor: this.acctsmanager,
            permission: active,
          },
        ],
        data: JSON.stringify({
          auth_acct: authority,
          trea_acct: treasury,
          trans_sec: 0,
        }),
      },
    ];
  }
  public makeCreateToken(
    dacauthority: ChainEntityName,
    dactreasury: ChainEntityName,
    maxSupply: ChainAsset,
    issuance: ChainAsset,
  ): Array<Action> {
    const dacTokenContract = toChainEntityName(
      this.configService.getLocalConfig().get('dactokencontract'),
    );

    return [
      //1. create token
      {
        account: this.acctsmanager,
        name: toChainEntityName('tokencreate'),
        authorization: [
          {
            actor: this.acctsmanager,
            permission: active,
          },
        ],
        data: JSON.stringify({
          issuer: dacauthority,
          maximum_supply: maxSupply,
        }),
      },
      //2. issue
      {
        account: this.acctsmanager,
        name: toChainEntityName('tokenissue'),
        authorization: [
          {
            actor: this.acctsmanager,
            permission: active,
          },
        ],
        data: JSON.stringify({
          memo: `token issue`,
          quantity: issuance,
          to: dacauthority,
        }),
      },
      //3. transfer to dactreasury
      this.makeXtransfer(
        dacauthority,
        dactreasury,
        {
          contract: dacTokenContract,
          quantity: issuance,
        },
        'get treasury token',
      ),
    ];
  }
  public makeLinkAuthorityPermissions(
    dacauthority,
    dactreasury,
  ): Array<Action> {
    const daccustodian = toChainEntityName(
      this.configService.getLocalConfig().get('custodiancontract'),
    );

    const dacmultisigs = toChainEntityName(
      this.configService.getLocalConfig().get('dacmsigcontract'),
    );
    const dacdirectory = toChainEntityName(
      this.configService.getLocalConfig().get('dacdirectory'),
    );

    const dacproposals = toChainEntityName(
      this.configService.getLocalConfig().get('dividendcontract'),
    );

    const dacescrow = this.configService.getLocalConfig().get('escrowcontract');

    const dacTokenContract = toChainEntityName(
      this.configService.getLocalConfig().get('dactokencontract'),
    );

    const authPerm = (permission: ChainEntityName): PermissionLevelDto => {
      return {
        actor: this.acctsmanager,
        permission: permission,
      };
    };

    const acctAauthOwnerAuth: AuthorityDto = {
      accounts: [
        {
          permission: {
            actor: daccustodian,
            permission: code,
          },
          weight: 1,
        },
      ],
      keys: [],
      threshold: 1,
      waits: [],
    };
    const acctAuthActiveAuth: AuthorityDto = {
      accounts: [
        {
          permission: {
            actor: dacauthority,
            permission: high,
          },
          weight: 1,
        },
      ],
      keys: [],
      threshold: 1,
      waits: [],
    };

    const authActiveAuth: AuthorityDto = {
      accounts: [
        {
          permission: {
            actor: dacauthority,
            permission: active,
          },
          weight: 1,
        },
      ],
      keys: [],
      threshold: 1,
      waits: [],
    };

    return [
      // link $dacauthority authority
      this.makeLinkAuth([authPerm(active)], {
        account: dacauthority,
        code: daccustodian,
        type: toChainEntityNameOrEmptyString(''),
        requirement: high,
      }),
      this.makeLinkAuth([authPerm(active)], {
        account: dacauthority,
        code: daccustodian,
        type: toChainEntityName('firecand'),
        requirement: med,
      }),
      this.makeLinkAuth([authPerm(active)], {
        account: dacauthority,
        code: daccustodian,
        type: toChainEntityName('firecust'),
        requirement: high,
      }),
      this.makeLinkAuth([authPerm(active)], {
        account: dacauthority,
        code: dacproposals,
        type: toChainEntityNameOrEmptyString(''),
        requirement: one,
      }),
      this.makeLinkAuth([authPerm(active)], {
        account: dacauthority,
        code: dacdirectory,
        type: toChainEntityName('regref'),
        requirement: low,
      }),
      this.makeLinkAuth([authPerm(active)], {
        account: dacauthority,
        code: dacmultisigs,
        type: toChainEntityNameOrEmptyString(''),
        requirement: admin,
      }),
      this.makeUpdateAuth([authPerm(owner)], {
        account: dacauthority,
        auth: acctAuthActiveAuth,
        parent: owner,
        permission: active,
      }),
      this.makeUpdateAuth([authPerm(owner)], {
        account: dacauthority,
        auth: acctAauthOwnerAuth,
        parent: toChainEntityNameOrEmptyString(''),
        permission: owner,
      }),

      //link $dactreasury authority
      this.makeLinkAuth([authPerm(active)], {
        account: dactreasury,
        code: dacescrow,
        type: toChainEntityNameOrEmptyString('approve'),
        requirement: escrow,
      }),
      this.makeLinkAuth([authPerm(active)], {
        account: dactreasury,
        code: dacescrow,
        type: toChainEntityName('init'),
        requirement: escrow,
      }),
      this.makeLinkAuth([authPerm(active)], {
        account: dactreasury,
        code: dacTokenContract,
        type: toChainEntityName('tansfer'),
        requirement: xfer,
      }),
      this.makeLinkAuth([authPerm(active)], {
        account: dactreasury,
        code: toChainEntityName(
          this.configService.getLocalConfig().get('systemtokencontract'),
        ),
        type: toChainEntityName('tansfer'),
        requirement: xfer,
      }),
      this.makeUpdateAuth([authPerm(owner)], {
        account: dactreasury,
        auth: authActiveAuth,
        parent: owner,
        permission: active,
      }),
      this.makeUpdateAuth([authPerm(owner)], {
        account: dactreasury,
        auth: authActiveAuth,
        parent: toChainEntityNameOrEmptyString(''),
        permission: owner,
      }),
    ];
  }
  public makeCreateAuth(
    dacauthority: ChainEntityName,
    dactreasury: ChainEntityName,
  ): Array<Action> {
    // read from static config
    const daccustodian = this.configService
      .getLocalConfig()
      .get('custodiancontract');

    const authPerm = (permission: ChainEntityName): PermissionLevelDto => {
      return {
        actor: this.acctsmanager,
        permission: permission,
      };
    };

    const acctManagerAuth: AuthorityDto = {
      accounts: [
        {
          permission: {
            actor: this.acctsmanager,
            permission: code,
          },
          weight: 1,
        },
      ],
      keys: [],
      threshold: 1,
      waits: [],
    };

    const propCodeAuth: AuthorityDto = {
      accounts: [
        {
          permission: {
            actor: this.configService.getLocalConfig().get('proposalcontract'),
            permission: code,
          },
          weight: 1,
        },
      ],
      keys: [],
      threshold: 1,
      waits: [],
    };
    //Pay attention to sorting
    const xferAuth: AuthorityDto = {
      accounts: [
        {
          permission: {
            actor: this.acctsmanager,
            permission: code,
          },
          weight: 2,
        },
        {
          permission: {
            actor: this.configService.getLocalConfig().get('proposalcontract'),
            permission: code,
          },
          weight: 1,
        },
        {
          permission: {
            actor: daccustodian,
            permission: code,
          },
          weight: 1,
        },
        {
          permission: {
            actor: dacauthority,
            permission: med,
          },
          weight: 2,
        },
      ],
      keys: [],
      threshold: 2,
      waits: [
        {
          wait_sec: 2,
          weight: 1,
        },
      ],
    };
    //sort by actor
    xferAuth.accounts.sort((obj1, obj2) => {
      const n1 = obj1.permission.actor;
      const n2 = obj2.permission.actor;

      if (n1 > n2) {
        return 1;
      }

      if (n1 < n2) {
        return -1;
      }

      return 0;
    });

    return [
      // new $dacauthority auth
      this.makeUpdateAuth([authPerm(owner)], {
        account: dacauthority,
        auth: acctManagerAuth,
        parent: active,
        permission: high,
      }),
      this.makeUpdateAuth([authPerm(owner)], {
        account: dacauthority,
        auth: acctManagerAuth,
        parent: high,
        permission: med,
      }),
      this.makeUpdateAuth([authPerm(owner)], {
        account: dacauthority,
        auth: acctManagerAuth,
        parent: med,
        permission: low,
      }),
      this.makeUpdateAuth([authPerm(owner)], {
        account: dacauthority,
        auth: acctManagerAuth,
        parent: low,
        permission: one,
      }),
      this.makeUpdateAuth([authPerm(owner)], {
        account: dacauthority,
        auth: acctManagerAuth,
        parent: one,
        permission: admin,
      }),
      // new dactreasury auth
      this.makeUpdateAuth([authPerm(owner)], {
        account: dactreasury,
        auth: propCodeAuth,
        parent: active,
        permission: escrow,
      }),
      this.makeUpdateAuth([authPerm(owner)], {
        account: dactreasury,
        auth: xferAuth,
        parent: active,
        permission: xfer,
      }),
    ];
  }
  public makeRegDacStep(
    dacId: ChainEntityName,
    appointedCustodians: Array<ChainEntityName>,
    dacauthority: ChainEntityName,
    dactreasury: ChainEntityName,
    title: string,
    maxSupply: ChainAsset,
    issuance: ChainAsset,
    custodianConfig: DacConfigDto,
    refs: Array<{ key: number; value: string }> = [],
  ): Array<Action> {
    const dacTokenContract = toChainEntityName(
      this.configService.getLocalConfig().get('dactokencontract'),
    );

    const daccustodian = toChainEntityName(
      this.configService.getLocalConfig().get('custodiancontract'),
    );

    const dacmultisigs = toChainEntityName(
      this.configService.getLocalConfig().get('dacmsigcontract'),
    );

    const dacescrow = toChainEntityName(
      this.configService.getLocalConfig().get('escrowcontract'),
    );

    const dividend = toChainEntityName(
      this.configService.getLocalConfig().get('dividendcontract'),
    );

    const dacproposals = toChainEntityName(
      this.configService.getLocalConfig().get('proposalcontract'),
    );

    return [
      //1. regdac
      {
        account: this.acctsmanager,
        name: toChainEntityName('regdac'),
        authorization: [
          {
            actor: this.acctsmanager,
            permission: active,
          },
        ],
        data: JSON.stringify({
          auth_acct: dacauthority,
          trea_acct: dactreasury,
          dac_id: dacId,
          dac_symbol: {
            contract: dacTokenContract,
            symbol: toChainSymbol(maxSupply),
          },
          title: title,
          refs: refs,
          accounts: [
            { key: ACCT_TYPE.ACCOUNT_AUTH, value: dacauthority },
            { key: ACCT_TYPE.ACCOUNT_TREASURY, value: dactreasury },
            { key: ACCT_TYPE.ACCOUNT_CUSTODIAN, value: daccustodian },
            { key: ACCT_TYPE.ACCOUNT_MSIGS, value: dacmultisigs },
            { key: ACCT_TYPE.ACCOUNT_PROPOSALS, value: dacproposals },
            { key: ACCT_TYPE.ACCOUNT_ESCROW, value: dacescrow },
            { key: ACCT_TYPE.ACCOUNT_DIVIDEND, value: dividend },
          ],
        }),
      },
      //2. updateconfig
      {
        account: this.acctsmanager,
        name: toChainEntityName('updateconfig'),
        authorization: [
          {
            actor: this.acctsmanager,
            permission: active,
          },
        ],
        data: JSON.stringify({
          dac_id: dacId,
          new_config: custodianConfig,
        }),
      },
      //3. newmemterms
      {
        account: this.acctsmanager,
        name: toChainEntityName('newmemterms'),
        authorization: [
          {
            actor: this.acctsmanager,
            permission: active,
          },
        ],
        data: JSON.stringify({
          terms: 'empty',
          hash: '00000000000000000000000000000000',
          dac_id: dacId,
        }),
      },
      //4. create issue transfer token
      ...this.makeCreateToken(dacauthority, dactreasury, maxSupply, issuance),
      // 5. appointcust
      {
        account: this.acctsmanager,
        name: toChainEntityName('appointcust'),
        authorization: [
          {
            actor: this.acctsmanager,
            permission: active,
          },
        ],
        data: JSON.stringify({
          cust: appointedCustodians,
          dac_id: dacId,
        }),
      },
    ];
  }
  public makeStartDAC(dacId: ChainEntityName): Array<Action> {
    const dacdirectory = toChainEntityName(
      this.configService.getLocalConfig().get('dacdirectory'),
    );
    const daccustodian = toChainEntityName(
      this.configService.getLocalConfig().get('custodiancontract'),
    );

    return [
      // 1. newperiod
      {
        account: daccustodian,
        name: toChainEntityName('newperiod'),
        authorization: [
          {
            actor: this.acctsmanager,
            permission: active,
          },
        ],
        data: JSON.stringify({
          message: `New Period for init ${dacId}`,
          dac_id: dacId,
        }),
      },
      // 2. setstatus
      {
        account: dacdirectory,
        name: toChainEntityName('setstatus'),
        authorization: [
          {
            actor: dacdirectory,
            permission: active,
          },
        ],
        data: JSON.stringify({
          dac_id: dacId,
          value: 1,
        }),
      },
    ];
  }

  makeCreateDacAccts(
    authority: ChainEntityName,
    treasury: ChainEntityName,
  ): Array<Action> {
    return [this.makeNewacct(authority), this.makeNewacct(treasury)];
  }

  makeUpgrade2PremiumDAC(
    dacCreator: ChainEntityName,
    treasury: ChainEntityName,
    pairToken: ChainSymbolCode,
    dexAcct: ChainEntityName,
    coreAsset: ExtendedAssetDto,
    dacAsset: ExtendedAssetDto,
  ): Array<Action> {
    return [
      // create  pair token
      ...this.makeCreatePairToken(
        dacCreator,
        treasury,
        pairToken,
        dexAcct,
        coreAsset,
        dacAsset,
      ),
    ];
  }

  makeDAC(
    dacId: ChainEntityName,
    appointedCustodians: Array<ChainEntityName>,
    authority: ChainEntityName,
    treasury: ChainEntityName,
    maxSupply: ChainAsset,
    issuance: ChainAsset,
    title: string,
    custodianConfig: DacConfigDto,
    refs: Array<{ key: number; value: string }>,
  ): Array<Action> {
    return [
      ...this.makeRegDacStep(
        dacId,
        appointedCustodians,
        authority,
        treasury,
        title,
        maxSupply,
        issuance,
        custodianConfig,
        refs,
      ),
      ...this.makeIniteDacAuths(authority, treasury),
      ...this.makeStartDAC(dacId),
    ];
  }

  //dex actions
  public makeCreatePairToken(
    coreTokenOffer: ChainEntityName,
    user: ChainEntityName,
    pairToken: ChainSymbolCode,
    dexAcct: ChainEntityName,
    coreExtAsset: ExtendedAssetDto,
    dacExtAsset: ExtendedAssetDto,
  ): Array<Action> {
    return [
      this.makeXtransfer(
        coreTokenOffer,
        user,
        coreExtAsset,
        `tansfer core token ${coreExtAsset.quantity} to create pairToken`,
      ),
      this.makeOpenext(user, {
        contract: coreExtAsset.contract,
        symbol: toChainSymbol(coreExtAsset.quantity),
      }),
      this.makeOpenext(user, {
        contract: dacExtAsset.contract,
        symbol: toChainSymbol(dacExtAsset.quantity),
      }),
      this.makeXtransfer(
        user,
        dexAcct,
        coreExtAsset,
        `tansfer token1 for create pairTokn ${pairToken}`,
      ),
      this.makeXtransfer(
        user,
        dexAcct,
        dacExtAsset,
        `tansfer token2 for create pairTokn ${pairToken}`,
      ),
      this.makeinitToken(
        user,
        toChainSymbolfromPrecision(
          pairToken,
          toChainPrecision(
            this.configService.getLocalConfig().get('pairTokenDecimals'),
          ),
        ),
        coreExtAsset,
        dacExtAsset,
      ),
    ];
  }
}
