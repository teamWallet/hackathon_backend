import { IsNotEmpty, IsString } from 'class-validator';

export class ProfileCheckData {
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
}
