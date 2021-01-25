import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { FilterTaskDTO } from './dto/filter-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: TaskRepository,
  ) {}

  async getTaskListArray(filterDto: FilterTaskDTO): Promise<Task[]> {
    return await this.taskRepository.getTaskListArray(filterDto);
  }

  async getTaskByID(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne(id);

    if (task == null) {
      throw new NotFoundException(`Task with id "${id}" not found`);
    }

    return task;
  }

  async createTask(createTaskDto: CreateTaskDTO): Promise<Task> {
    return await this.taskRepository.createTask(createTaskDto);
  }

  async deleteTaskByID(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with id "${id}" not found`);
    }
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskByID(id);
    task.status = status;
    await task.save();

    return task;
  }
}
