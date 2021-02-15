import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { ChainEntityName } from '../../../types';
export class VoteDto {
  @IsNotEmpty()
  @IsString()
  name: ChainEntityName;

  @IsNotEmpty()
  @ValidateNested()
  votes: ChainEntityName[];

  @IsNotEmpty()
  @IsString()
  dacId: ChainEntityName;
}
