import {
  IsOptional,
  IsNumber,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Action } from './transaction.dto';
export class TransactDto {
  @IsOptional()
  @IsNumber()
  public delaySec: number;

  @IsNotEmpty()
  @ValidateNested()
  public actions: Action[];

  constructor(actions: Action[]) {
    this.actions = actions;
    this.delaySec = 0;
  }
}
