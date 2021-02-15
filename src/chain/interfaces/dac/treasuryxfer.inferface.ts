import { ChainEntityName } from '../../types';
import { ExtendedAssetDto } from '../../dto/comm';

export interface TreasuryxferInfo {
  dacId: ChainEntityName;
  to: ChainEntityName;
  foQuantity: ExtendedAssetDto;
  memo: string;
}
