import { IsNotEmpty, IsString } from 'class-validator';

export class ChainAcctRequest {
  @IsNotEmpty()
  @IsString()
  username: string;
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  symbol: string;
  @IsNotEmpty()
  @IsString()
  point: string;
}
