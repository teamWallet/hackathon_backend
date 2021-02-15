import { IsNotEmpty, IsString } from 'class-validator';

export class ListProposalDto {
  name: string;

  status: string;

  type: string;

  dacId: string;

  pageSize?: number;
  current: number;
}

/* task list */
export class ListTaskDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  dacId?: string;

  userRole?: string;

  status?: number;

  pageSize?: number;

  current?: number;
}

export class ListTaskRewardDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
