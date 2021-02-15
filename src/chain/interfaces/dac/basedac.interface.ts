import { ChainEntityName, ChainAsset } from '../../types';

export interface BaseDacInfo {
  dacId: ChainEntityName;
  dacCreator: ChainEntityName;
  authority: ChainEntityName;
  treasury: ChainEntityName;
  maxSupply: ChainAsset;
  issuance: ChainAsset;
  title: string;
  refs: Array<{ key: number; value: string }>;
}
