import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskService {
  private taskListArray = [];

  getTaskListArray() {
    return this.taskListArray;
  }
}
