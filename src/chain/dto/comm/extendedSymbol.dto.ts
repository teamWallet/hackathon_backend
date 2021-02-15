import { IsNotEmpty, IsString } from 'class-validator';
import { ChainEntityName, ChainSymbol } from '../../types';

export class ExtendedSymbolDto {
  @IsNotEmpty()
  @IsString()
  public readonly contract: ChainEntityName;
  @IsNotEmpty()
  @IsString()
  public readonly symbol: ChainSymbol;
}
