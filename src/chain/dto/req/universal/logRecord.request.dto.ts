import { IsNotEmpty, IsString } from 'class-validator';
export class LogRecordDto {
  @IsNotEmpty()
  @IsString()
  // action params string with delimiter
  paramStr: string;

  @IsNotEmpty()
  @IsString()
  // the delimiter in paramStr
  delimiter: string;
}
