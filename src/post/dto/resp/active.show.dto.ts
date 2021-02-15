import { IsNotEmpty, IsString } from 'class-validator';

export class ActiveShowResponse {
  name: string;
  upID: string;
  likeFlag: boolean;
}

export class ListActiveResponse {
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
  data: ActiveShowResponse;
}
