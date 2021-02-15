import { IsNotEmpty, IsString } from 'class-validator';

export class InvitationCodeCheckData {
  /**
   * RegisterUserInput username.
   * @type {string|undefined}
   */
  fullname?: string;
  @IsNotEmpty()
  @IsString()
  code: string;
}
export class InvitationCodeReqData {
  name: string;
  fullname: string;
  info: string;
}
