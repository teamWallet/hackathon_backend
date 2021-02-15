import { IsNotEmpty, IsString } from 'class-validator';

export class ProfileCheckResponse {
  /**
   * RegisterUserInput username.
   * @type {string|undefined}
   */
  // @IsNotEmpty()
  // @IsString()
  @IsNotEmpty()
  @IsString()
  name: string;

  /**
   * RegisterUserInput email.
   * @type {string|undefined}
   */
  // @IsString()
  // email?: string;
  /**
   * RegisterUserInput password.
   * @type {string|undefined}
   */
  @IsNotEmpty()
  @IsString()
  nickName: string;

  used: boolean;
}
export class ProfileCheckResponseDto {
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
  data: ProfileCheckResponse;
}
