import { PremiumDacInfo } from './premiumdac.interface';
import { ChainEntityName } from '../../types';
export interface CustomDacInfo extends PremiumDacInfo {
  numelected: number;
  periodlength: number;
  appointedCustodians: Array<ChainEntityName>;
}
