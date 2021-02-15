import { ChainEntityName } from '../../types';
import { ExtendedAssetDto } from '../../dto/comm';

export interface XtansferInfo {
  from: ChainEntityName;
  to: ChainEntityName;
  foQuantity: ExtendedAssetDto;
  memo: string;
}
