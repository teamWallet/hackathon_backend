import { IsNotEmpty, IsString } from 'class-validator';
import { ChainEntityName, ChainSymbolCode } from '../../../types';

export class BalanceDto {
  @IsNotEmpty()
  @IsString()
  public readonly code: ChainEntityName;
  @IsNotEmpty()
  @IsString()
  public readonly name: ChainEntityName;
  @IsNotEmpty()
  @IsString()
  public readonly symbol: ChainSymbolCode;
}
