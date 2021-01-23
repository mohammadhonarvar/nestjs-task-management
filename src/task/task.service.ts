import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v1 as uuidv1 } from 'uuid';
import { CreateTaskDTO } from './dto/create-task.dto';
import { FilterTaskDTO } from './dto/filter-task.dto';
@Injectable()
export class TaskService {
  private taskListArray: Task[] = [];

  getTaskListArray(): Task[] {
    return this.taskListArray;
  }

  getTaskListArrayWithFilters(filterDto: FilterTaskDTO): Task[] {
    const { search, status } = filterDto;
    let taskList = this.taskListArray;

    if (status != null) {
      taskList = this.taskListArray.filter((task) => task.status === status);
    }

    if (search != null) {
      taskList = this.taskListArray.filter(
        (task) => task.title.indexOf(search) !== -1 || task.description.indexOf(search) !== -1,
      );
    }

    return taskList;
  }

  getTaskByID(id: string): { index: number; task: Task } {
    const taskIndex = this.taskListArray.findIndex((task) => task.id === id);

    if (taskIndex === -1) {
      throw new NotFoundException(`Task with id "${id}" not found`);
    }

    return {
      index: taskIndex,
      task: this.taskListArray[taskIndex],
    };
  }

  createTask(createTaskDto: CreateTaskDTO): Task {
    const { title, description } = createTaskDto;

    const newTask = {
      id: uuidv1(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.taskListArray.push(newTask);
    return newTask;
  }

  deleteTaskByID(id: string): Task {
    const taskData = this.getTaskByID(id);
    this.taskListArray.splice(taskData.index, 1);
    return taskData.task;
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskByID(id).task;
    task.status = status;
    return task;
  }
}
