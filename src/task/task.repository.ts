import { InternalServerErrorException, Logger } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';
import { FilterTaskDTO } from './dto/filter-task.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository');

  async getTaskListArray(filterDto: FilterTaskDTO, user: User): Promise<Task[]> {
    const { search, status } = filterDto;
    const query = this.createQueryBuilder();

    query.where('task.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere('task.title LIKE :search OR task.description LIKE :search', { search: `%${search}%` });
    }

    try {
      const taskListArray = await query.getMany();
      return taskListArray;
    } catch (error) {
      this.logger.error(
        `getTaskListArray => filters: ${JSON.stringify(filterDto)}, user: ${user.username}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async createTask(createTaskDto: CreateTaskDTO, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const newTask = new Task();
    newTask.title = title;
    newTask.description = description;
    newTask.status = TaskStatus.OPEN;
    newTask.user = user;

    try {
      await newTask.save();
    } catch (error) {
      this.logger.error(
        `createTask => params: ${JSON.stringify(createTaskDto)}, user: ${user.username}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }

    delete newTask.user;
    return newTask;
  }
}
