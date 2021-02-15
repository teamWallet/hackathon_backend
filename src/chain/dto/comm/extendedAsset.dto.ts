import { IsNotEmpty, IsString } from 'class-validator';
import { ChainAsset, ChainEntityName } from '../../types';
export class ExtendedAssetDto {
  @IsNotEmpty()
  @IsString()
  public readonly contract: ChainEntityName;
  @IsNotEmpty()
  @IsString()
  public readonly quantity: ChainAsset;
}
