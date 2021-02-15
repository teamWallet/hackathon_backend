import { IsNotEmpty, IsString } from 'class-validator';

export class CommentShowData {
  /**
   * @type {string|undefined}
   */
  @IsString()
  name: string;

  // /**
  //  * @type {string|undefined}
  //  */
  // type: string;

  /**
   * @type {string|undefined}
   */
  @IsString()
  upID: string;
  /**
   * @type {string|undefined}
   */
  @IsString()
  id?: string;
  /**
   * PostPublishData commentTitle.
   * @type {string|undefined}
   */
  @IsString()
  title?: string;
  /**
   * PostPublishData commentTitle.
   * @type {string|undefined}
   */
  @IsString()
  content: string;
  /**
   * PostPublishData postContent.
   * @type {string|undefined}
   */
  @IsString()
  images: string;

  /**
   * PostPublishData postAddressInfo.
   * @type {string|undefined}
   */
  @IsString()
  brief?: string;
  /**
   * PostPublishData postAddressInfo.
   * @type {string|undefined}
   */
  @IsString()
  tag?: string;
  /**
   * PostData create time.
   * @type {string|undefined}
   */
  @IsString()
  createAt: string;

  // /**
  //  * PostData update time.
  //  * @type {string|undefined}
  //  */
  // @IsString()
  // updatedAt?: string;
  /**
   * @type {number|undefined}
   */
  likes: number;
  /**
   * @type {number|undefined}
   */
  views: number;
  /**
   * @type {number|undefined}
   */
  comments: number;
  /**
   * @type {number|undefined}
   */
  //collects: number;
  nickName: string;
  avatar: string;

  replynickname?: string;
}

export class CommentListData {
  /**
   * PostShowData userInfo.
   * @type {number|undefined}
   */
  count: number;

  /**
   * PostShowData userInfo.
   * @type {object|undefined}
   */
  data: CommentShowData[];
}

export class CommentShowListData {
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
  data: CommentListData;
}
