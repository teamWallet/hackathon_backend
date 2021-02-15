export class TaskPublishRequest {
  title: string;
  body: string;
  status: string;
  neededLikes: number;
  payment: number;
  name: string;
  executorName: string;
  dueAt: string;
  publishAt: string;
  ownerInfo: string;
  executorInfo: string;
}

export class TaskUpdateRequest {
  taskId: string;
  status: string;
}
