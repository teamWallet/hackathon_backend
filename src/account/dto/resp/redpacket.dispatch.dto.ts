import { IsNotEmpty, IsString } from 'class-validator';

export class RedpacketDispatchResponseDto {
  /**
   * RegisterUserInput username.
   * @type {string|undefined}
   */
  // @IsNotEmpty()
  // @IsString()
  @IsNotEmpty()
  @IsString()
  name: string;
  dacId?: string;
  packetId: string;
  sender: string;
  quantity: string;
  mode: string;
  memo: string;
  acctPool: string;
  trxid: string;
}

export class RedpacketDispatchResponse {
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
   * @type {string|undefined}
   */
  @IsNotEmpty()
  @IsString()
  data: RedpacketDispatchResponseDto;
}
