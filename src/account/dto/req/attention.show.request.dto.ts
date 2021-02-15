import { IsNotEmpty, IsString } from 'class-validator';

export class AttentionShowRequest {
  name: string;
  pageSize?: number;
  current: number;
  // actionType: number;
  // followers following
  role: string;
  // upUser?: string;
}
