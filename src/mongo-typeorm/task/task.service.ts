import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { FilterTaskDTO } from './dto/filter-task.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: TaskRepository,
  ) {}

  async getTaskListArray(filterDto: FilterTaskDTO, user: User): Promise<Task[]> {
    return this.taskRepository.getTaskListArray(filterDto, user);
  }

  async getTaskByID(id: string, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne(id, {
      where: {
        userId: user.id,
      },
    });

    if (task == null) {
      throw new NotFoundException(`Task with id "${id}" not found`);
    }

    return task;
  }

  async createTask(createTaskDto: CreateTaskDTO, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async deleteTaskByID(id: string, user: User): Promise<void> {
    await this.getTaskByID(id, user);
    this.taskRepository.delete(id);
  }

  async updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.getTaskByID(id, user);
    task.status = status;
    await this.taskRepository.save(task);

    return task;
  }
}
