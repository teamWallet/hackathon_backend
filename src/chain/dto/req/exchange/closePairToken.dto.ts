import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { ChainEntityName, ChainSymbolCode } from '../../../types';
import { ExtendedSymbolDto } from '../../comm';
export class ClosePairTokenDto {
  @IsNotEmpty()
  @IsString()
  user: ChainEntityName;

  @IsNotEmpty()
  @IsString()
  pairToken: ChainSymbolCode;

  @IsNotEmpty()
  @ValidateNested()
  extSymbol1: ExtendedSymbolDto;

  @IsNotEmpty()
  @ValidateNested()
  extSymbol2: ExtendedSymbolDto;
}
