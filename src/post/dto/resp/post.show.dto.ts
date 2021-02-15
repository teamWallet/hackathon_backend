import { IsNotEmpty, IsString } from 'class-validator';

export class PostShowData {
  id: number;
  /**
   * PostData username.
   * @type {string|undefined}
   */
  @IsString()
  username: string;

  /**
   * @type {string|undefined}
   */
  @IsString()
  postId: string;
  /**
   * PostData postTitle.
   * @type {string|undefined}
   */
  @IsString()
  title?: string;
  /**
   * PostData postContent.
   * @type {string|undefined}
   */
  @IsString()
  content: string;
  /**
   * PostData momentContent.
   * @type {string|undefined}
   */
  images: string;

  /**
   * @type {string|undefined}
   */
  @IsString()
  tag?: string;

  /**
   * PostData brief.
   * @type {string|undefined}
   */
  @IsString()
  brief?: string;

  /**
   * PostData postAddressInfo.
   * @type {string|undefined}
   */
  @IsString()
  addressInfo?: string;

  /**
   * PostData create time.
   * @type {string|undefined}
   */
  @IsString()
  createAt: string;

  mode: string;
  type: string;
  status: string;

  // /**
  //  * PostData update time.
  //  * @type {string|undefined}
  //  */
  // @IsString()
  // updatedAt?: string;

  // postLikeViewInfo: LikeReadCollectData
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
  collects: number;
  nickName: string;
  avatar: string;
  top?: number;
  now?: string;
  isDelete?: number;
  isPrivate?: number;

  authorName?: string;
  authorNickName?: string;
  authorAvatar?: string;
}

export class PostListData {
  /**
   * PostShowData userInfo.
   * @type {number|undefined}
   */
  count: number;

  /**
   * PostShowData userInfo.
   * @type {object|undefined}
   */
  data: PostShowData[];
}

export class PostShowListData {
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
  data: PostListData;
}
