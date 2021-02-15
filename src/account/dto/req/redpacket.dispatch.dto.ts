import { IsNotEmpty, IsString } from 'class-validator';

export class RedpacketDispatchDto {
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

  quantity: string;
  redNumber: number;
  mode: string;
  memo: string;
}
