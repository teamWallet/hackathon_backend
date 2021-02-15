import { ChainEntityName, ChainSymbolCode } from '../../types';
import { ExtendedAssetDto } from '../../dto';
export interface Upgrade2PremiumInfo {
  coreTokenOffer: ChainEntityName;
  treasury: ChainEntityName;
  pairToken: ChainSymbolCode;
  coreAsset: ExtendedAssetDto;
  dacAsset: ExtendedAssetDto;
}
