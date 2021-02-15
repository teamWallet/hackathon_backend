import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsString,
} from 'class-validator';
import { ChainEntityName } from '../../types';
export class TableRowDto {
  @IsNotEmpty()
  @IsBoolean()
  public json: boolean;

  @IsNotEmpty()
  @IsString()
  public code: ChainEntityName;

  @IsNotEmpty()
  @IsString()
  public scope: ChainEntityName;

  @IsNotEmpty()
  @IsString()
  public table: ChainEntityName;

  @IsOptional()
  @IsString()
  public tableKey?: string = '';

  @IsOptional()
  @IsString()
  public lowerBound?: string = '';

  @IsOptional()
  @IsString()
  public upperBound?: string = '';

  @IsOptional()
  @IsNumber()
  public indexPosition?: number = 1;

  @IsOptional()
  @IsString()
  public keyType?: string = '';

  @IsOptional()
  @IsNumber()
  public limit?: number = 10;

  @IsOptional()
  @IsBoolean()
  public reverse?: boolean = false;

  @IsOptional()
  @IsBoolean()
  public showPayer?: boolean = false;
}
