import { IsNotEmpty, IsString } from 'class-validator';

export class AssetsDto {
  /**
   * RegisterUserInput username.
   * @type {string|undefined}
   */
  name: string;
  tokenIcon: string;
  symbol: string;
  quantity: string;
  amount: string;
  assets: string;
}
export class AssetsResponseList {
  count: number;
  assets: string;
  data: AssetsDto[];
}
export class AssetsResponseDto {
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
  data: AssetsResponseList;
}

export class AssetResponseDto {
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
  data: AssetsDto;
}
