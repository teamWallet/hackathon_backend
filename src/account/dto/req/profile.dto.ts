import { IsNotEmpty, IsString } from 'class-validator';

export class ProfileData {
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
  avatar: string;
  @IsNotEmpty()
  @IsString()
  nickName: string;
  @IsNotEmpty()
  @IsString()
  gender: string;
  @IsString()
  address: string;
  @IsNotEmpty()
  @IsString()
  profile: string;
  // @IsNotEmpty()
  // @IsString()
  // qrCode: string;
  @IsString()
  birthday: string;
}

export interface ProfileRequest {
  name: string;
  avatar: string;
  nickName: string;
  gender: string;
  address: string;
  profile: string;
  qrCode: string;
  birthday: string;
}