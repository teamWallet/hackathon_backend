import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class FaceCheckResponse {
  /**
   * @type {string|undefined}
   */
  @IsNotEmpty()
  @IsString()
  faceId: string;
  @IsBoolean()
  used: boolean;
}
export class FaceCheckResponseDto {
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
  data: FaceCheckResponse;
}
