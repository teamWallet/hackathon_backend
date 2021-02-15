import {
  IsNotEmpty,
  IsString,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { ChainEntityName } from '../../types';

import { PermissionLevelDto } from './authority.dto';
export class Action {
  @IsNotEmpty()
  @IsString()
  account: ChainEntityName;

  @IsNotEmpty()
  @IsString()
  name: ChainEntityName;

  @IsNotEmpty()
  @ValidateNested()
  authorization: PermissionLevelDto[];

  @IsNotEmpty()
  @ValidateNested()
  data: string | { [key: string]: any };
}

export class Extension {
  type: number /*uint16*/;
  data: string /*bytes*/;
}

export class TransactionHeader {
  @IsNotEmpty()
  @IsString()
  expiration = '' /*time_point_sec*/;

  @IsNotEmpty()
  @IsNumber()
  refBlockNum = 0 /*uint16*/;

  @IsNotEmpty()
  @IsNumber()
  refBlockPrefix = 0 /*uint32*/;

  @IsNotEmpty()
  @IsNumber()
  maxNetUsageWords = 0 /*varuint32*/;

  @IsNotEmpty()
  @IsNumber()
  maxCpuUsageMs = 0 /*uint8*/;

  @IsNotEmpty()
  @IsNumber()
  delaySec = 0 /*varuint32*/;

  constructor(expiration: string) {
    this.expiration = expiration;
  }
}

export class TransactionDto extends TransactionHeader {
  @IsNotEmpty()
  @ValidateNested()
  contextFreeActions: Action[] = [];

  @IsNotEmpty()
  @ValidateNested()
  actions: Action[] = [];

  @IsNotEmpty()
  @ValidateNested()
  transactionExtensions: Extension[] = [];

  constructor(actions: Action[], expiration: string) {
    super(expiration);
    this.actions = actions;
  }
}
