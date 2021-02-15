import {
  ValidateNested,
  IsBoolean,
  IsNotEmpty,
  IsString,
} from 'class-validator';
export class ResponseTableDto {
  @ValidateNested()
  // public rows: string | { [key: string]: any }[];
  public rows: { [key: string]: any }[];
  @IsNotEmpty()
  @IsBoolean()
  public more: boolean;

  @IsNotEmpty()
  @IsString()
  public nextKey: string;
}
