import { ChainEntityName } from '../../types';

export interface CancelContractInfo {
  contractId: ChainEntityName;
  canceler: ChainEntityName;
}
