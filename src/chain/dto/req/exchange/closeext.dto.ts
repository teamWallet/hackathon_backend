import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { ChainEntityName } from '../../../types';
import { ExtendedSymbolDto } from '../../comm';
export class CloseextDto {
  @IsNotEmpty()
  @IsString()
  user: ChainEntityName;

  @IsNotEmpty()
  @IsString()
  // token receiver
  to: ChainEntityName;

  @IsNotEmpty()
  @ValidateNested()
  extSymbol: ExtendedSymbolDto;

  @IsNotEmpty()
  @IsString()
  memo: string;
}
