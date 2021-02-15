import { IsNotEmpty, IsString } from 'class-validator';

export class AttentionRequest {
  name: string;
  upUser: string;
  actionType: boolean;
}
