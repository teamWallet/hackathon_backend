// import { IsNotEmpty, IsString } from 'class-validator';

export class UserReqDto {
  /**
   * RegisterUserInput username.
   * @type {string|undefined}
   */
  // @IsNotEmpty()
  // @IsString()
  name: string;
}
