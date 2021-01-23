import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { allowedTaskStatusList } from '../task.model';

export class FilterTaskDTO {
  @IsOptional()
  @IsNotEmpty()
  search: string;

  @IsOptional()
  @IsIn(allowedTaskStatusList)
  status: string;
}
