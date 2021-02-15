import { ChainEntityName } from '../../types';
import { ExtendedAssetDto } from '../../dto/comm';

export interface CreateContractInfo {
  contractId: ChainEntityName;
  partyA: ChainEntityName;
  partyB: ChainEntityName;
  title: string;
  content: string;
  contentHash: string;
  contractPay: ExtendedAssetDto;
}
