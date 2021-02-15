import { IsString } from 'class-validator';

export class PostActiveData {
  /**
   * PostActiveData upPostID
   * @type {string|undefined}
   */
  @IsString()
  name: string;
  /**
   * PostActiveData postTitle.
   * @type {string|undefined}
   */
  @IsString()
  type: string;

  /**
   * PostActiveData postTitle.
   * @type {string|undefined}
   */
  @IsString()
  upID: string;
  /**
   * PostActiveData postContent.
   * @type {boolean|undefined}
   */
  likeFlag?: boolean;
  /**
   * PostActiveData momentContent.
   * @type {boolean|undefined}
   */
  readFlag?: boolean;

  /**
   * PostActiveData momentContent.
   * @type {boolean|undefined}
   */
  collectFlag?: boolean;
}