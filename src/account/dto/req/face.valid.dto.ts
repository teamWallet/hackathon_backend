import { IsNotEmpty, IsString } from 'class-validator';

export class FaceCheckData {
  /**
   * @type {string|undefined}
   */
  @IsNotEmpty()
  @IsString()
  faceId: string;
}
