import { ChainEntityName } from '../../types';
import { ExtendedAssetDto } from '../../dto/comm';

export interface StakeInfo {
  owner: ChainEntityName;
  foQuantity: ExtendedAssetDto;
}
