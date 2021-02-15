import { IsNotEmpty, IsString } from 'class-validator';

export class GiveRewardsDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  rewards: number;

  @IsNotEmpty()
  @IsString()
  extra? : string;

}
