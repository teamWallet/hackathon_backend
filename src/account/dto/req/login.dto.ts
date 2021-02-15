// import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  //name?: string;
  // @IsNotEmpty()
  // @IsString()
  faceId?: string;
  /**
   * RegisterUserInput password.
   * @type {string|undefined}
   */
  // @IsNotEmpty()
  // @IsString()
  // feature: string;

  // @IsNotEmpty()
  // @IsString()
  username?: string;

  // @IsNotEmpty()
  // @IsString()
  password?: string;

  // @IsNotEmpty()
  // @IsString()
  // invitationCode: string;
}
