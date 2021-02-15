import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class SetTaskStatusDto {
  @IsNotEmpty()
  @IsString()
  taskId: string;

  @IsNotEmpty()
  @IsString()
  executorId: string;

  @IsNotEmpty()
  @IsString()
  dacId: string;

  @IsNumber()
  id: number;
}
