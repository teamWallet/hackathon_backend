import { PropsalBaseInfo } from '../propsalbase.interface';
import { ChainEntityName } from '../../../types';
import { ExtendedAssetDto } from '../../../dto/comm';

export interface PropTransferInfo extends PropsalBaseInfo {
  actionData: {
    to: ChainEntityName;
    foQuantity: ExtendedAssetDto;
    memo: string;
  };
}
