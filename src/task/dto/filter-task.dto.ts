import { TaskStatus } from '../task.model';

export class FilterTaskDTO {
  search: string;
  status: TaskStatus;
}
