import { ChainAsset, ChainEntityName } from '../../types';

export interface BurnContractInfo {
  beBurner: ChainEntityName;
  quantity: ChainAsset;
}
