import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class UserSymbolDto {
  /**
   * RegisterUserInput username.
   * @type {string|undefined}
   */
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  symbol: string;

  @IsOptional()
  @IsNumber()
  current: number;
  @IsOptional()
  @IsNumber()
  pageSize: number;
}
