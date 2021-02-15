import { IsNotEmpty } from 'class-validator';

export class PostModifyReqDto {
  /**
   * PostModifyDto username
   * @type {string|undefined}
   */
  name?: string;

  /**
   * PostActiveData postTitle.
   * @type {string}
   */
  @IsNotEmpty()
  postId: string;

  /**
   * PostModifyDto isDelete
   * @type {boolean|undefined}
   */
  isDelete?: boolean;

  /**
   * PostModifyDto isPublic
   * @type {boolean|undefined}
   */
  isPrivate?: boolean;
}
