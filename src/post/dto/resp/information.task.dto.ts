import { IsNotEmpty, IsString } from 'class-validator';
// import { DailyTaskResp } from '../../../dac/dto';

export class UniversalResponse {
  @IsNotEmpty()
  @IsString()
  result: string;

  // @IsNotEmpty()
  // dailyTaskResp: DailyTaskResp;
}
