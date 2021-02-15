/* eslint-disable camelcase */
import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { toChainEntityName, toChainAssetFromSymbolCode } from '../../utils';
import { ExtendedAssetDto } from './extendedAsset.dto';
export class DacConfigDto {
  @IsNotEmpty()
  @ValidateNested()
  lockupasset: ExtendedAssetDto = {
    contract: toChainEntityName('eosio.token'),
    quantity: toChainAssetFromSymbolCode('0.0000', 'EOS'),
  };
  @IsNotEmpty()
  @IsNumber()
  maxvotes = 3;

  @IsNotEmpty()
  @IsNumber()
  numelected = 5;

  @IsNotEmpty()
  @IsNumber()
  periodlength = 3075840000;

  @IsNotEmpty()
  @IsNumber()
  should_pay_via_service_provider = false;

  @IsNotEmpty()
  @IsNumber()
  initial_vote_quorum_percent = 0;

  @IsNotEmpty()
  @IsNumber()
  vote_quorum_percent = 0;

  @IsNotEmpty()
  @IsNumber()
  auth_threshold_high = 0;

  @IsNotEmpty()
  @IsNumber()
  auth_threshold_mid = 0;

  @IsNotEmpty()
  @IsNumber()
  auth_threshold_low = 0;

  @IsNotEmpty()
  @IsNumber()
  lockup_release_time_delay = 0;
  @IsNotEmpty()
  @ValidateNested()
  requested_pay_max: ExtendedAssetDto = {
    contract: toChainEntityName('eosio.token'),
    quantity: toChainAssetFromSymbolCode('0.0000', 'EOS'),
  };
}
