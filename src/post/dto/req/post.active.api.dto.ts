import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class PostActiveDataDto {
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
  @IsOptional()
  @IsBoolean()
  likeFlag?: boolean;
  /**
   * PostActiveData momentContent.
   * @type {boolean|undefined}
   */
  @IsOptional()
  @IsBoolean()
  readFlag?: boolean;

  /**
   * PostActiveData momentContent.
   * @type {boolean|undefined}
   */
  @IsOptional()
  @IsBoolean()
  collectFlag?: boolean;
}
