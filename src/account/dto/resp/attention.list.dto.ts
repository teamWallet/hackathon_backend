import { IsNotEmpty, IsString } from 'class-validator';

export class AttentionShow {
  // mobile: string;
  name: string;
  nickName: string;
  avatar: string;
  // publishNumber: number;
  // fansNumber: number;
  // yes no
  // eachOther: boolean;
}

export class AttentionListData {
  /**
   * PostShowData userInfo.
   * @type {number|undefined}
   */
  count: number;

  /**
   * PostShowData userInfo.
   * @type {object|undefined}
   */
  data: AttentionShow[];
}
