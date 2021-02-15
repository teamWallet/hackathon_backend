// import { IsNotEmpty, IsString } from 'class-validator';

export class LikeShowRequest {
  pageSize?: number;
  current: number;
  upID: string;
  sortType?: string;
}
