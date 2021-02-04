import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { TaskDocument, TaskModel } from './task.schema';
// import { TaskStatus } from './task-status.enum';
import { InjectModel } from '@nestjs/mongoose';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
// import { User } from '../auth/user.entity';

@Injectable()
export class TaskService {
  private readonly logger = new Logger('TaskService');

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

  async createTask(createTaskDto: CreateTaskDTO): Promise<TaskDocument> {
    const { title, description } = createTaskDto;

    const newTask = new this.taskModel();
    newTask.title = title;
    newTask.description = description;
    newTask.status = TaskStatus.OPEN;
    // newTask.user = user;

    try {
      await newTask.save();
      return newTask;
    } catch (error) {
      this.logger.error(`createTask => params: ${JSON.stringify(createTaskDto)}`, error.stack);
      throw new InternalServerErrorException();
    }
  }

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
