import { IsNotEmpty, IsString } from 'class-validator';

export class AuthorityResponseDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  disable: string[];
  enable: string[];
}
export class AuthorityResponse {
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
  data: AuthorityResponseDto;
}
