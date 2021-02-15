import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { ChainEntityName, ChainDate } from '../../../types';
import { toChainDate } from '../../../utils';
import { PermissionLevelDto, Action } from '../../comm';
export class ProposeDto {
  @IsNotEmpty()
  @IsString()
  dacId: ChainEntityName;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  // default 3 days
  @IsNotEmpty()
  @IsString()
  expiration: ChainDate = toChainDate(
    new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000),
  );

  @IsNotEmpty()
  @IsString()
  proposer: ChainEntityName;

  @IsNotEmpty()
  @IsString()
  propsalName: ChainEntityName;

  @IsNotEmpty()
  @ValidateNested()
  requested: PermissionLevelDto[];

  @IsNotEmpty()
  @ValidateNested()
  actions: Action[];

  @IsOptional()
  @IsNumber()
  delaySec?: number = 0;
}
