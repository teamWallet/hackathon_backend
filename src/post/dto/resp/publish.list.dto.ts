import { IsNotEmpty, IsString } from 'class-validator';

export class MyPublishShow {
  id: string;
  name: string;
  nickName: string;
  images: string;
  likes: number;
  module: string;
  title: string;
  avatar: string;
}

export class MyPublishListData {
  /**
   * PostShowData userInfo.
   * @type {number|undefined}
   */
  count: number;

  /**
   * PostShowData userInfo.
   * @type {object|undefined}
   */
  data: MyPublishShow[];
}

export class ListPublishResponse {
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
   * @type {string|undefined}
   */
  @IsNotEmpty()
  @IsString()
  data: MyPublishListData;
}
