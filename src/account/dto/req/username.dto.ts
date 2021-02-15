import { IsNotEmpty, IsString } from 'class-validator';

export class CheckUserNameInput {
  /**
   * RegisterUserInput username.
   * @type {string|undefined}
   */
  // @IsNotEmpty()
  // @IsString()
  @IsNotEmpty()
  @IsString()
  username: string;
}
