import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  // UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { FilterTaskDTO } from './dto/filter-task.dto';
import { TaskStatusValidationPipe } from './pipe/task-status-validation.pipe';
import { TaskStatus } from './task-status.enum';
import { TaskService } from './task.service';
// import { Task } from './task.schema';
// import { AuthGuard } from '@nestjs/passport';
import { TaskDocument } from './task.schema';
import { TaskIdValidationPipe } from './pipe/task-id-validation.pipe';
import { FilterTaskValidationPipe } from './pipe/filter-task-validation.pipe';
// import { GetUser } from '../auth/get-user.decorator';
// import { User } from '../auth/user.entity';

@Controller('task')
// @UseGuards(AuthGuard())
export class TaskController {
  // private readonly logger = new Logger('TaskController');

  constructor(private readonly taskService: TaskService) {}

  @Get('list')
  getTaskList(
    @Query(ValidationPipe, FilterTaskValidationPipe) filterTaskDTO: FilterTaskDTO,
  ): Promise<TaskDocument[]> {
    return this.taskService.getTaskListArray(filterTaskDTO);
  }

  @Get('/:id')
  getTaskByID(@Param('id', TaskIdValidationPipe) taskId: string): Promise<TaskDocument> {
    return this.taskService.getTaskByID(taskId);
  }

  @Post('create')
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDTO): Promise<TaskDocument> {
    return this.taskService.createTask(createTaskDto);
  }

  @Delete('/:id')
  deleteTaskByID(@Param('id', TaskIdValidationPipe) taskId: string): Promise<void> {
    return this.taskService.deleteTaskByID(taskId);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id', TaskIdValidationPipe) taskId: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ): Promise<TaskDocument> {
    return this.taskService.updateTaskStatus(taskId, status);
  }
}
