import { IsNotEmpty, IsString } from 'class-validator';

export class LikeShowData {
  nickName: string;
}

export class LikeListData {
  /**
   * PostShowData userInfo.
   * @type {number|undefined}
   */
  count: number;

  /**
   * PostShowData userInfo.
   * @type {object|undefined}
   */
  data: LikeShowData[];
}

export class LikeShowListData {
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
  data: LikeListData;
}
