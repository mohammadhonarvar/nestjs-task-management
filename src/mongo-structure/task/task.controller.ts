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
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
// import { CreateTaskDTO } from './dto/create-task.dto';
// import { FilterTaskDTO } from './dto/filter-task.dto';
// import { TaskStatusValidationPipe } from './pipe/task-status-validation.pipe';
// import { TaskStatus } from './task-status.enum';
import { TaskService } from './task.service';
// import { Task } from './task.schema';
import { AuthGuard } from '@nestjs/passport';
import { TaskDocument } from './task.schema';
// import { GetUser } from '../auth/get-user.decorator';
// import { User } from '../auth/user.entity';

@Controller('task')
@UseGuards(AuthGuard())
export class TaskController {
  private readonly logger = new Logger('TaskController');

  constructor(private readonly taskService: TaskService) {}

  @Get('list')
  getTaskList(): Promise<TaskDocument[]> {
    return this.taskService.getTaskListArray();
  }

  @Get('/:id')
  getTaskByID(@Param('id', ParseUUIDPipe) taskId: string): Promise<TaskDocument> {
    return this.taskService.getTaskByID(taskId);
  }

  // @Post('create')
  // @UsePipes(ValidationPipe)
  // createTask(@Body() createTaskDto: CreateTaskDTO, @GetUser() user: User): Promise<Task> {
  //   return this.taskService.createTask(createTaskDto, user);
  // }

  // @Delete('/:id')
  // deleteTaskByID(@Param('id', ParseIntPipe) taskId: number, @GetUser() user: User): Promise<void> {
  //   return this.taskService.deleteTaskByID(taskId, user);
  // }

  // @Patch('/:id/status')
  // updateTaskStatus(
  //   @Param('id', ParseIntPipe) taskId: number,
  //   @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  //   @GetUser() user: User,
  // ): Promise<Task> {
  //   return this.taskService.updateTaskStatus(taskId, status, user);
  // }
}
