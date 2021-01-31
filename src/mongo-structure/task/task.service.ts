import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskDocument, TaskModel } from './task.schema';
// import { TaskStatus } from './task-status.enum';
import { InjectModel } from '@nestjs/mongoose';
// import { User } from '../auth/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel('Task')
    private readonly taskModel: TaskModel,
  ) {}

  async getTaskListArray(): Promise<TaskDocument[]> {
    return await this.taskModel.find();
  }

  async getTaskByID(id: string): Promise<TaskDocument> {
    const task = await this.taskModel.findById(id);

    if (task == null) {
      throw new NotFoundException(`Task with id "${id}" not found`);
    }

    return task;
  }

  // async createTask(createTaskDto: CreateTaskDTO, user: User): Promise<Task> {
  //   return this.taskModel.createTask(createTaskDto, user);
  // }

  // async deleteTaskByID(id: number, user: User): Promise<void> {
  //   const result = await this.taskModel.delete({
  //     id,
  //     userId: user.id,
  //   });

  //   if (result.affected === 0) {
  //     throw new NotFoundException(`Task with id "${id}" not found`);
  //   }
  // }

  // async updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<Task> {
  //   const task = await this.getTaskByID(id, user);
  //   task.status = status;
  //   await task.save();

  //   return task;
  // }
}
