import { IsNotEmpty, IsString } from 'class-validator';

export class RedpacketListReqDto {
  /**
   * RegisterUserInput username.
   * @type {string|undefined}
   */
  // @IsNotEmpty()
  // @IsString()
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsString()
  dacId?: string;

  packetId: string;
  // quantity: string;
  // redNumber: number;
  // mode: string;
  // memo: string;
}
