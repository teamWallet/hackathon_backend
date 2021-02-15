import { IsNotEmpty, IsString } from 'class-validator';

export class TaskListRespData {
  taskId: string;
  title: string;
  body?: string;
  status: string;
  neededLikes: number;
  payment: number;
  name: string;
  executorName: string;
  dueAt?: string;
  publishAt?: string;
  createdAt: string;
  updatedAt: string;
  ownerInfo: string;
  executorInfo: string;
  postId?: string;
}

export class TaskListResponse {
  /**
   * Response code.
   * @type {number|undefined}
   */
  @IsNotEmpty()
  @IsString()
  code: number;
  /**
   * Response message.
   * @type {string|undefined}
   */
  @IsNotEmpty()
  @IsString()
  message: string;

  /**
   * TaskListRespData
   * @type {array|undefined}
   */
  data?: TaskListRespData[];
}
