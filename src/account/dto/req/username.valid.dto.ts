import { IsNotEmpty, IsString } from 'class-validator';
// import { UserNameEntity } from 'src/account/types';

export class UsernameCheckData {
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
