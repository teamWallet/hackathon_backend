import { PropsalBaseInfo } from '../propsalbase.interface';
import { ChainEntityName } from '../../../types';
export interface PropLockAccountInfo extends PropsalBaseInfo {
  members: ChainEntityName | ChainEntityName[];
}
