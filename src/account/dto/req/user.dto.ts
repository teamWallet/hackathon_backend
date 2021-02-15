import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UserReqDto {
  /**
   * RegisterUserInput username.
   * @type {string|undefined}
   */
  // @IsNotEmpty()
  // @IsString()
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  tokenSymbol: string;
}
