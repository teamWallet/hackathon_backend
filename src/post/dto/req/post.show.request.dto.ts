// import { IsNotEmpty, IsString } from 'class-validator';

export class PostShowRequest {
  name?: string;
  pageSize?: number;
  current: number;
  actionType?: string;
  status?: string;
  sortType?: string;
  postId?: string;
  dacId: string;
  type: string;
}
