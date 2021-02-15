import { IsNotEmpty, IsString, IsInt, IsDate } from 'class-validator';
// import { Approval } from '../common';


/* task list */
export class DacTaskResponseListDto {
  role?: string;
  data: DacTaskList[];
}

export class DacTaskList {
  dacId: string;
  taskId: string;
  status: number;
  rewardValue: number;
  title: string;
  dacName: string;
  symbolName: string;
  limit: number;
  avatar: string;
  executeNum: number;
  expiration?: string;
}

export class DacTaskResponseList {
  @IsNotEmpty()
  @IsString()
  code: number;
  /**
   * RegisterUserInput password.
   * @type {string|undefined}
   */
  @IsNotEmpty()
  @IsString()
  message: string;

  /**
   * RegisterUserInput password.
   * @type {object|undefined}
   */
  @IsNotEmpty()
  data: DacTaskResponseListDto[];
}

export class TaskData {
  // 任务 ID
  @IsNotEmpty()
  @IsString()
  taskId: string;

  // 任务名称
  @IsNotEmpty()
  @IsString()
  name: string;

  // 任务状态(已完成，未完成和进行中)
  @IsNotEmpty()
  @IsString()
  status: string;

  //  奖励
  reward: TaskReword;

  // 创建时间
  @IsDate()
  createTime: Date;

  // 单日上限(日常任务)
  Uplimit?: number;

  // 截止时间(指定任务)
  endTime?: Date;
}

export class TaskReword {
  // 奖励类型
  @IsNotEmpty()
  @IsString()
  type: string;

  // 奖励数
  @IsInt()
  value: number;
}

export class ListTaskRewardResponse {
  @IsInt()
  code: number;

  @IsNotEmpty()
  @IsString()
  message: string;

  data: TaskRewarData;
}

export class TaskRewarData {
  total: string;
  rewards: TaskRewardArray[];
}

export class TaskRewardArray {
  @IsNotEmpty()
  @IsString()
  dacId: string;

  @IsNotEmpty()
  @IsString()
  taskId: string;

  @IsNotEmpty()
  @IsString()
  creater: string;

  @IsNotEmpty()
  @IsString()
  executor: string;

  @IsInt()
  executeNum: number;

  @IsNotEmpty()
  @IsString()
  rewardName: string;

  @IsInt()
  rewardValue: number;

  @IsNotEmpty()
  @IsString()
  symbolName: string;

  @IsNotEmpty()
  @IsString()
  mode: string;

  @IsInt()
  limit: number;

  @IsInt()
  status: number;

  @IsInt()
  recieve: number;

  @IsString()
  title: string;

  @IsInt()
  id: number;
  // dac_tasks.id
}
