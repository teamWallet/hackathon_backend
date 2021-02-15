import ConfigLoader from './config-loader';
import { toChainEntityName } from '../chain/utils';

export enum ACCT_TYPE {
  ACCOUNT_AUTH = 0,
  ACCOUNT_TREASURY = 1,
  ACCOUNT_CUSTODIAN = 2,
  ACCOUNT_MSIGS = 3,
  ACCOUNT_SERVICE = 5,
  ACCOUNT_PROPOSALS = 6,
  ACCOUNT_ESCROW = 7,
  ACCOUNT_DIVIDEND = 8,
  ACCOUNT_EXTERNAL = 254,
  ACCOUNT_OTHER = 255,
}

export enum REF_TYPE {
  REF_HOMEPAGE = 0,
  REF_LOGO_URL = 1,
  REF_DESCRIPTION = 2,
  REF_LOGO_NOTEXT_URL = 3,
  REF_BACKGROUND_URL = 4,
  REF_COLORS = 5,
  REF_CLIENT_EXTENSION = 6,
  REF_FAVICON_URL = 7,
  REF_DAC_CURRENCY_URL = 8,
  REF_SYSTEM_CURRENCY_URL = 9,
  REF_DISCORD_URL = 10,
  REF_TELEGRAM_URL = 11,
}

export class DacDirectory {
  private dacId: string;
  private directoryAccount: string;
  private api;
  private dacData: any;
  constructor(api, config: ConfigLoader, dacId = '') {
    if (dacId === '') {
      this.dacId = config.get('sysDacId');
    } else {
      this.dacId = dacId;
    }
    this.directoryAccount = config.get('dacdirectory');
    this.api = api;
    this.dacData = null;
    console.log(
      `DACDirectory loaded with ID ${this.dacId} on directory ${this.directoryAccount}`,
    );
  }

  processMap(chainData) {
    const retData = [];
    chainData.forEach(v => {
      retData[v.key] = v.value;
    });
    return retData;
  }

  getAccount(accountType) {
    return this.dacData.accounts[accountType];
  }

  getRef(refType) {
    return this.dacData.refs[refType];
  }

  getSymbol() {
    return this.dacData.symbol;
  }

  getSymbolContract() {
    return this.dacData.symbol.contract;
  }

  getSymbolCode() {
    const [, code] = this.dacData.symbol.symbol.split(',');
    return code;
  }

  getSymbolPrecision() {
    const [precisionStr] = this.dacData.symbol.symbol.split(',');
    return parseInt(precisionStr);
  }

  getState() {
    return this.dacData.dac_state;
  }

  getTitle() {
    return this.dacData.title;
  }
  getDacId() {
    return this.dacId;
  }
  async reload(dacId: string) {
    if (dacId === '') {
      dacId = this.dacId;
    }
    try {
      // const res = await this.api.rpc.get_table_rows({
      //   code: this.directoryAccount,
      //   scope: this.directoryAccount,
      //   table: toChainEntityName('dacs'),
      //   // eslint-disable-next-line @typescript-eslint/camelcase
      //   lower_bound: dacId,
      //   // eslint-disable-next-line @typescript-eslint/camelcase
      //   upper_bound: dacId,
      // });
      // const dacData = res.rows[0];
      // dacData.accounts = this.processMap(dacData.accounts);
      // dacData.refs = this.processMap(dacData.refs);
      // this.dacId = dacData.dac_id;
      // this.dacData = dacData;
      // console.log('dac directory reload', dacData);
    } catch (e) {
      console.error('dac directory reload failed: ', e);
    }
  }
}
