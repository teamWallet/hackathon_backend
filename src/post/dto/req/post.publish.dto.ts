// import { IsNotEmpty, IsString } from 'class-validator';

export class PostPublishData {
  content: string;
  title?: string;
  images: string;
  tag?: string;
  brief?: string;
  addressInfo?: string;
  // owner
  name: string;
  postId?: string;

  // user or draft
  mode: string;
  top?: number;

  authorName?: string;
  authorNickName?: string;
  authorAvatar?: string;
}
