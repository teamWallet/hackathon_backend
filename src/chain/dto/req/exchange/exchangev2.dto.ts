import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { ChainEntityName, ChainSymbolCode, ChainAsset } from '../../../types';
import { ExtendedAssetDto } from '../../comm';
export class ExchangeV2Dto {
  @IsNotEmpty()
  @IsString()
  user: ChainEntityName;

  @IsNotEmpty()
  @IsString()
  pairToken1: ChainSymbolCode;

  @IsNotEmpty()
  @IsString()
  pairToken2: ChainSymbolCode;

  @IsNotEmpty()
  @ValidateNested()
  extAssetIn: ExtendedAssetDto;

  @IsNotEmpty()
  @ValidateNested()
  minExpected: ChainAsset;
}
