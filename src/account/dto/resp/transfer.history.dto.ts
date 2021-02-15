import { IsNotEmpty, IsString } from 'class-validator';

export class TransferHistoryDto {
  /**
   * RegisterUserInput username.
   * @type {string|undefined}
   */
  id: number;
  from: string;
  to: string;
  tokenIcon: string;
  symbol: string;
  quantity: string;
  memo: string;
  createAt: string;
  fromAvatar: string;
  toAvatar: string;
  fromNickName: string;
  toNickName: string;
}
export class TransferHistoryList {
  count: number;
  data: TransferHistoryDto[];
}

export class TransferHistoryResponseDto {
  /**
   * RegisterUserInput countryCode.
   * @type {number|undefined}
   */
  @IsNotEmpty()
  @IsString()
  code: number;
  /**
   * RegisterUserInput password.
   * @type {string|undefined}
   */
  @IsNotEmpty()
  @IsString()
  message: string;

  /**
   * RegisterUserInput password.
   * @type {object|undefined}
   */
  @IsNotEmpty()
  data: TransferHistoryList;
}
