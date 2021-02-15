import { IsNotEmpty, IsString } from 'class-validator';

export class UserPageReqDto {
  /**
   * RegisterUserInput username.
   * @type {string|undefined}
   */
  // @IsNotEmpty()
  // @IsString()
  @IsNotEmpty()
  @IsString()
  name: string;

  current?: number;
  pageSize?: number;
}
