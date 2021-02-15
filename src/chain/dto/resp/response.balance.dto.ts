import { IsNotEmpty, IsString } from 'class-validator';
export class ResponseBalanceDto {
  @IsNotEmpty()
  @IsString()
  public balance: string;
}
