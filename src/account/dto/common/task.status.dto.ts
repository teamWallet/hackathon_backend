export enum TaskConfigStatus {
  OPEN = 1,
  EXPIRED = 2,
  CANCELED = 3,
  UNNORMAL = 4,
}

export enum TaskStatus {
  OPEN = 1,
  COMPLETED = 2,
  UNNORMAL = 3,
}

export enum TaskReceive {
  INIT = 1,
  WAITING = 2,
  COMPLETED = 3,
  UNNORMAL = 4,
  // RECEIVING = 5,
}
