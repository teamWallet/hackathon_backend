import { IsNotEmpty, IsString } from 'class-validator';

export class RedpacketRecieveReqDto {
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
}
