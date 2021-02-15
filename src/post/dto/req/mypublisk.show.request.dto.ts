// import { IsNotEmpty, IsString } from 'class-validator';

export class MyPublishRequest {
  name: string;
  pageSize?: number;
  current: number;
  actionType?: string;
  sortType?: string;
  dacId?: string;
  type: string;
}
