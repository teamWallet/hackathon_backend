import { ChainEntityName } from '../../types';
import { ExtendedAssetDto } from '../../dto/comm';

export interface PayContractInfo {
  contractId: ChainEntityName;
  payer: ChainEntityName;
  payment: ExtendedAssetDto;
}
