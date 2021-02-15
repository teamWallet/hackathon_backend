import { IsNotEmpty, IsString } from 'class-validator';
import { ChainEntityName } from '../../../types';
export class LinkAuthDto {
  @IsNotEmpty()
  @IsString()
  account: ChainEntityName;

  @IsNotEmpty()
  @IsString()
  code: ChainEntityName;

  @IsNotEmpty()
  @IsString()
  requirement: ChainEntityName;

  @IsNotEmpty()
  @IsString()
  type: ChainEntityName | '';
}
