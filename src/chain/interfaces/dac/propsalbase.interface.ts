import { ChainEntityName, ChainDate } from '../../types';

export interface PropsalBaseInfo {
  proposer: ChainEntityName;
  dacId: ChainEntityName;
  title: string;
  description: string;
  expiration: ChainDate;
}
