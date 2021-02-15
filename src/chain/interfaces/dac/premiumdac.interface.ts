import { ChainSymbolCode } from '../../types';
import { BaseDacInfo } from './basedac.interface';
import { ExtendedAssetDto } from '../../dto/comm';

export interface PremiumDacInfo extends BaseDacInfo {
  pairToken: ChainSymbolCode;
  coreAsset: ExtendedAssetDto;
  dacAsset: ExtendedAssetDto;
}
