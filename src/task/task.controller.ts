import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { FilterTaskDTO } from './dto/filter-task.dto';
import { TaskStatusValidationPipe } from './pipe/task-status-validation.pipe';
import { TaskStatus } from './task-status.enum';
import { TaskService } from './task.service';
import { Task } from './task.entity';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get('list')
  getTaskList(@Query(ValidationPipe) filterDto: FilterTaskDTO): Promise<Task[]> {
    return this.taskService.getTaskListArray(filterDto);
  }

  @Get('/:id')
  getTaskByID(@Param('id', ParseIntPipe) taskId: number): Promise<Task> {
    return this.taskService.getTaskByID(taskId);
  }

  @Post('create')
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDTO): Promise<Task> {
    return this.taskService.createTask(createTaskDto);
  }

  @Delete('/:id')
  deleteTaskByID(@Param('id', ParseIntPipe) taskId: number): Promise<void> {
    return this.taskService.deleteTaskByID(taskId);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id', ParseIntPipe) taskId: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ): Promise<Task> {
    return this.taskService.updateTaskStatus(taskId, status);
  }
}
