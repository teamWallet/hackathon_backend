import { IsNotEmpty, IsString } from 'class-validator';
import { ChainEntityName } from '../../../types';
export class CallActionDto {
  @IsNotEmpty()
  @IsString()
  // smart contract name
  code: ChainEntityName;

  @IsNotEmpty()
  @IsString()
  // action name
  funcName: string;

  @IsNotEmpty()
  @IsString()
  // action params string with delimiter
  paramStr: string;

  @IsNotEmpty()
  @IsString()
  // the delimiter in paramStr
  delimiter: string;
}
