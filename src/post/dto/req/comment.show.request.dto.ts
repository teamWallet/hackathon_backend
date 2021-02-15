// import { IsNotEmpty, IsString } from 'class-validator';

export class CommentShowRequest {
  name?: string;
  pageSize?: number;
  current: number;
  upID: string;
  // actionType?: string;
  sortType?: string;
}
