import { IsNotEmpty, IsString } from 'class-validator';
import { ChainEntityName } from '../../../types';
export class NewAcctDto {
  @IsNotEmpty({ message: 'account should not be empty' })
  @IsString({ message: 'account must be string' })
  public readonly name: ChainEntityName;
}
