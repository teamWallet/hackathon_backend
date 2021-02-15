import { IsNotEmpty, IsString } from 'class-validator';
// import { PasswordEntity, UserNameEntity } from 'src/account/types';

export class SignupUserReqDto {
  /**
   * RegisterUserInput username.
   * @type {string|undefined}
   */
  @IsNotEmpty()
  @IsString()
  faceId: string;
  /**
   * RegisterUserInput password.
   * @type {string|undefined}
   */
  // avatar url
  photo?: string;

  fullname?: string;

  @IsNotEmpty()
  @IsString()
  username: string;
  // username: UserNameEntity;

  @IsNotEmpty()
  @IsString()
  password: string;

  // @IsNotEmpty()
  // @IsString()
  // invitationCode: string;
}
export class SignupUserDto {
  /**
   * RegisterUserInput username.
   * @type {string|undefined}
   */
  @IsNotEmpty()
  @IsString()
  faceId: string;
  /**
   * RegisterUserInput password.
   * @type {string|undefined}
   */
  // avatar url
  photo?: string;

  @IsNotEmpty()
  @IsString()
  username: string;
  // username: UserNameEntity;
  fullname?: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  invitationCode: string;
}
