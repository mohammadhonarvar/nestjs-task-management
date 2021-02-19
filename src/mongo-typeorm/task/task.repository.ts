import { InternalServerErrorException, Logger } from '@nestjs/common';
import { User } from '../auth/user.entity';
import { EntityRepository, FilterQuery, MongoRepository } from 'typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';
import { FilterTaskDTO } from './dto/filter-task.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TaskRepository extends MongoRepository<Task> {
  private logger = new Logger('TaskRepository');

  async getTaskListArray(filterTaskDTO: FilterTaskDTO, user: User): Promise<Task[]> {
    const { search, status } = filterTaskDTO;
    const filterQueryList: FilterQuery<Task>[] = [];

    filterQueryList.push({
      userId: user.id,
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
      return await this.find({
        where: {
          $and: filterQueryList,
        },
      });
    }

    return await this.find();
  }

  async createTask(createTaskDto: CreateTaskDTO, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const newTask = new Task();
    newTask.title = title;
    newTask.description = description;
    newTask.status = TaskStatus.OPEN;
    newTask.userId = user.id;

    try {
      await newTask.save();
    } catch (error) {
      this.logger.error(
        `createTask => params: ${JSON.stringify(createTaskDto)}, user: ${user.username}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }

    delete newTask.userId;
    return newTask;
  }
}
