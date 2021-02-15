import { IsNotEmpty, IsString } from 'class-validator';

export class StringResponse {
  /**
   * RegisterUserInput password.
   * @type {object|undefined}
   */
  // @IsNotEmpty()
  data: string;
}
export class NormalResponse {
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
  data: string;
}
