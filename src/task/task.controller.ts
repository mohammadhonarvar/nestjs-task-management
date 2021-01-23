import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { FilterTaskDTO } from './dto/filter-task.dto';
import { TaskStatusValidationPipe } from './pipe/task-status-validation.pipe';
import { Task, TaskStatus } from './task.model';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get('list')
  getTaskList(@Query(ValidationPipe) filterDto: FilterTaskDTO): Task[] {
    if (Object.keys(filterDto).length === 0) {
      return this.taskService.getTaskListArray();
    }

    return this.taskService.getTaskListArrayWithFilters(filterDto);
  }

  @Get('/:id')
  getTaskByID(@Param('id') taskId: string): Task {
    return this.taskService.getTaskByID(taskId).task;
  }

  @Post('create')
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDTO): Task {
    return this.taskService.createTask(createTaskDto);
  }

  @Delete('/:id')
  deleteTaskByID(@Param('id') taskId: string): Task {
    return this.taskService.deleteTaskByID(taskId);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') taskId: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ): Task {
    return this.taskService.updateTaskStatus(taskId, status);
  }
}
