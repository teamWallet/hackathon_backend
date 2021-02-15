export interface CreateTaskInput {
  dacId: string;
  creater: string;
  title: string;
  type: string;
  rewardValue: number;
  executors: string[];
  reviewers?: string[];
  description?: string;
  expiration?: string;
  rewardName?: string;
  limit?: number;
}

export interface TaskCreateObj {
  taskId: string;
  type: string;
  executor: string;
}

export interface CancelTaskInput {
  canceler: string;
  taskId: string;
  dacId: string;
}

export interface ConfigTaskInput {
  configData: {
    dacId: string;
    taskId: string;
    type: string;
    operator: string;
    rewardValue?: number;
    limit?: number;
    expiration?: string;
  }[];
}

// export interface ConfigTaskData {
//   dacId: string;
//   taskId: string;
//   type: string;
//   operator: string;
//   rewardValue?: number;
//   limit?: number;
//   expiration?: Date;
//   // controllers?: string[];
//   // reviewers?: string[];
// }
export interface InitTaskArgs {
  dacId: string;
  creater: string;
}

export interface ListTaskInput {
  name: string;
  type: string;
  userRole?: string;
  dacId?: string;
  status?: number;
  current?: number;
  pageSize?: number;
}

export interface ShowTaskInput {
  dacId: string;
  name: string;
  taskId?: string;
  type?: string;
  status?: number;
  expiration?: Date;
}

export interface TaskUniversalDailyDto {
  name: string;
  dacId: string;
  type: string;
}

export interface MarkTaskInput {
  dacId: string;
  executorId: string;
  taskId: string;
  id: number;
}

export interface EventStreamInput {
  dacId: string;
  streamId: string;
  streamType: string;
  name: string;
  description?: number;
  pageSize?: number;
  current?: number;
}

export interface ListTaskRewardInput {
  name: string;
}
export interface RecordStore {
  dacId: string;
  streamId: string;
  streamType: string;
  // nickName: string;
  name: string;
  description: string;
  eventType?: string;
  commentId?: string;
  images?:string;
}

export interface InitTaskData {
  rewardValue: 2;
  title: string;
  eventId: number;
  type: string;
  content: string;
}

export interface InsetMeberInput {
  dacId: string;
  name: string;
  authority: string[];
}
