import * as configFile from 'config';

export default class ConfigLoader {
  private configFile;
  constructor() {
    this.configFile = configFile;
  }

  get(configquery) {
    switch (configquery) {
      case 'endpoints':
        return this.configFile.endpoints;
      case 'sysDacId':
        return this.configFile.sysDacId;
      case 'hashData':
        return this.configFile.hashData;
      case 'systemtokensymbol':
        return this.configFile.systemToken.symbol;
      case 'systemtokendecimals':
        return this.configFile.systemToken.precision;
      case 'systemtokencontract':
        return this.configFile.systemToken.contract;
      case 'systemmsigcontract':
        return this.configFile.contracts.systemmsig.name;
      case 'coreDacTokenContract':
        return this.configFile.coreDacToken.contract;
      case 'coreDacTokenDecimals':
        return this.configFile.coreDacToken.precision;
      case 'coreDacTokenSymbol':
        return this.configFile.coreDacToken.symbol;
      case 'stableTokenList':
        return this.configFile.stableTokenList;
      case 'usdTokenContract':
        return this.configFile.stableTokenList.usdToken.contract;
      case 'usdTokenDecimals':
        return this.configFile.stableTokenList.usdToken.precision;
      case 'usdcTokenSymbol':
        return this.configFile.stableTokenList.usdToken.symbol;
      case 'dacissuance':
        return this.configFile.chainNumber.total;
      case 'pairtokenusdstake':
        return this.configFile.chainNumber.stake;
      case 'pairtokendacstake':
        return this.configFile.chainNumber.quantity;
      case 'dactokencontract':
        return this.configFile.contracts.dactokencontract.name;
      case 'dacdirectory':
        return this.configFile.contracts.directory.name;
      case 'acctsmanager':
        return this.configFile.contracts.acctsmanager.name;
      case 'authcontract':
        return this.configFile.contracts.authcontract.name;
      case 'treasurycontract':
        return this.configFile.contracts.treasurycontract.name;
      case 'custodiancontract':
        return this.configFile.contracts.custodiancontract.name;
      case 'dacmsigcontract':
        return this.configFile.contracts.dacmsigcontract.name;
      case 'proposalcontract':
        return this.configFile.contracts.proposalcontract.name;
      case 'escrowcontract':
        return this.configFile.contracts.escrowcontract.name;
      case 'dividendcontract':
        return this.configFile.contracts.dividendcontract.name;
      case 'daclogrecord':
        return this.configFile.contracts.daclogrecord.name;
      case 'dexcontract':
        return this.configFile.contracts.dexcontract.name;
      case 'redenvelope':
        return this.configFile.contracts.redenvelope.name;
      case 'expirationInterval':
        return this.configFile.expirationInterval;
      case 'partnerCode':
        return this.configFile.payment.partnerCode;
      case 'credentialCode':
        return this.configFile.payment.credentialCode;
      case 'pairTokenDecimals':
        return this.configFile.exchange.pairToken.precision;
      case 'makecontract':
          return this.configFile.contracts.makecontract.name;
      default:
        return `***${configquery} not yet subscribed in config-loader***`;
    }
  }

  setConfig(conf) {
    this.configFile = conf;
  }
}
