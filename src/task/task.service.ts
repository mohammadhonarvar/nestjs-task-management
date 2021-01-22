import { Injectable } from '@nestjs/common';
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

  getTaskByID(id: string): Task {
    return this.taskListArray.find((task) => task.id === id);
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

  deleteTaskByID(id: string): Task | null {
    const index = this.taskListArray.findIndex((task) => task.id === id);
    const deletedTask = this.taskListArray[index];
    if (index === -1) return null;

    this.taskListArray.splice(index, 1);
    return deletedTask;
  }

  updateTaskStatus(id: string, status: TaskStatus): Task | null {
    const task = this.getTaskByID(id);
    if (task == null) return null;

    task.status = status;
    return task;
  }
}
