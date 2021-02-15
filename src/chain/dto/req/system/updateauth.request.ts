import { IsNotEmpty, IsString } from 'class-validator';
import { AuthorityDto } from '../../comm';
import { ChainEntityName } from '../../../types';
export class UpdateAuthDto {
  @IsNotEmpty()
  @IsString()
  // smart contract name
  account: ChainEntityName;

  @IsNotEmpty()
  @IsString()
  auth: AuthorityDto;

  @IsNotEmpty()
  @IsString()
  parent: ChainEntityName | '';

  @IsNotEmpty()
  @IsString()
  permission: ChainEntityName;
}
