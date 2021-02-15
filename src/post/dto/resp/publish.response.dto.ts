import { IsNotEmpty, IsString } from 'class-validator';
import { UniversalResponse } from './information.task.dto';

export class UniversalTaskResponseDto {
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
  data: UniversalResponse;
}
