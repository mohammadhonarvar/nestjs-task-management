import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { TaskDocument, TaskModel } from './task.schema';
// import { TaskStatus } from './task-status.enum';
import { InjectModel } from '@nestjs/mongoose';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { FilterTaskDTO } from './dto/filter-task.dto';
import { FilterQuery } from 'mongoose';
import { UserDocument } from '../auth/user.schema';
@Injectable()
export class TaskService {
  private readonly logger = new Logger('TaskService');

  constructor(
    @InjectModel('Task')
    private readonly taskModel: TaskModel,
  ) {}

  async getTaskListArray(filterTaskDTO: FilterTaskDTO, user: UserDocument): Promise<TaskDocument[]> {
    const { search, status } = filterTaskDTO;
    const filterQueryList: FilterQuery<TaskDocument>[] = [];

    filterQueryList.push({
      user: user._id,
    });

    if (search) {
      filterQueryList.push({
        $or: [
          {
            description: {
              $regex: new RegExp(search, 'i'),
            },
          },
          {
            title: {
              $regex: new RegExp(search, 'i'),
            },
          },
        ],
      });
    }

    if (status) {
      filterQueryList.push({
        status: status as TaskStatus,
      });
    }

    if (filterQueryList.length > 0) {
      return await this.taskModel.find({
        $and: filterQueryList,
      });
    }

    return await this.taskModel.find();
  }

  async getTaskByID(id: string, user: UserDocument): Promise<TaskDocument> {
    const task = await this.taskModel.findOne({
      $and: [
        {
          _id: id,
        },
        {
          user: user._id,
        },
      ],
    });

    if (task == null) {
      throw new NotFoundException(`Task with id "${id}" not found`);
    }

    return task;
  }

  async createTask(createTaskDto: CreateTaskDTO, user: UserDocument): Promise<TaskDocument> {
    const { title, description } = createTaskDto;

    const newTask = new this.taskModel();
    newTask.title = title;
    newTask.description = description;
    newTask.status = TaskStatus.OPEN;
    newTask.user = user._id;

    try {
      await newTask.save();
      return newTask;
    } catch (error) {
      this.logger.error(`createTask => params: ${JSON.stringify(createTaskDto)}`, error.stack);
      throw new InternalServerErrorException();
    }
  }

  async deleteTaskByID(id: string, user: UserDocument): Promise<void> {
    const result = await this.taskModel.deleteOne({
      _id: id,
      user: user._id,
    });
    this.logger.debug(`Task is: ${JSON.stringify(result)}`);

    if (result.deletedCount === 0) {
      throw new NotFoundException(`Task with id "${id}" not found`);
    }
  }

  async updateTaskStatus(id: string, status: TaskStatus, user: UserDocument): Promise<TaskDocument> {
    const task = await this.getTaskByID(id, user);
    task.status = status;
    await task.save();

    return task;
  }
}
