import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { ChainEntityName, ChainSymbolCode, ChainAsset } from '../../../types';
import { ExtendedAssetDto } from '../../comm';
export class ExchangeDto {
  @IsNotEmpty()
  @IsString()
  user: ChainEntityName;

  @IsNotEmpty()
  @IsString()
  pairToken: ChainSymbolCode;

  @IsNotEmpty()
  @ValidateNested()
  extAssetIn: ExtendedAssetDto;

  @IsNotEmpty()
  @ValidateNested()
  minExpected: ChainAsset;
}
