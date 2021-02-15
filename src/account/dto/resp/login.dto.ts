import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class TokenResponse {
  /**
   * RegisterUserInput password.
   * @type {number|undefined}
   */
  // @IsNotEmpty()
  // @IsString()
  // expiresIn: string;
  // /**
  //  * RegisterUserInput password.
  //  * @type {string|undefined}
  //  */
  // @IsNotEmpty()
  // @IsString()
  // token: string;
  @IsNotEmpty()
  @IsString()
  name: string;
  // @IsNotEmpty()
  // @IsString()
  // imToken: string;
}

export class LoginResponse {
  /**
   * RegisterUserInput countryCode.
   * @type {number|undefined}
   */
  @IsInt()
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
  data: TokenResponse;
}
