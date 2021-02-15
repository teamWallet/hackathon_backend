import { IsNotEmpty, IsString } from 'class-validator';
import { ChainEntityName } from '../../../types';

export class OperationProposalDto {
  @IsNotEmpty()
  @IsString()
  dacId: ChainEntityName;

  @IsNotEmpty()
  @IsString()
  name: ChainEntityName;

  @IsNotEmpty()
  @IsString()
  proposer: ChainEntityName;

  @IsNotEmpty()
  @IsString()
  propsalName: ChainEntityName;
  // dac_id: string;
}
