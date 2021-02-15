// import { IsNotEmpty, IsString } from 'class-validator';

export class CommentPublishData {
  content: string;
  title?: string;
  images?: string;
  tag?: string;
  brief?: string;
  name: string;
  upID: string;
  type?: string;
  username?: string;
  // comment proposal
  reply?: string;
}
