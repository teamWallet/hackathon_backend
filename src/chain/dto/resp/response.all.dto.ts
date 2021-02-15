import { IsNotEmpty, IsString } from 'class-validator';
export class ResponseAllDto {
  @IsNotEmpty()
  @IsString()
  public transactionId: string;
}
