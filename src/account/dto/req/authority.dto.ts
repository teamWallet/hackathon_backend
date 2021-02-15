import { IsNotEmpty, IsString } from 'class-validator';

export class AuthorityReqDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  disable: string[];
  enable: string[];
}
