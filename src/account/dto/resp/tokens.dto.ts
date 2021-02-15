import { IsNotEmpty, IsString } from 'class-validator';

export class TokensDto {
  /**
   * RegisterUserInput username.
   * @type {string|undefined}
   */
  name: string;
  tokenIcon: string;
  symbol: string;
  quantity: string;
  pairToken: string;
  exRatio: string;
}
export class TokensResponseList {
  count: number;
  data: TokensDto[];
}
export class TokensResponseDto {
  /**
   * RegisterUserInput countryCode.
   * @type {number|undefined}
   */
  @IsNotEmpty()
  @IsString()
  code: number;
  /**
   * RegisterUserInput password.
   * @type {string|undefined}
   */
  @IsNotEmpty()
  @IsString()
  message: string;

  /**
   * RegisterUserInput password.
   * @type {object|undefined}
   */
  @IsNotEmpty()
  data: TokensResponseList;
}
