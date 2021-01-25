import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { FilterTaskDTO } from './dto/filter-task.dto';
import { TaskStatusValidationPipe } from './pipe/task-status-validation.pipe';
import { TaskStatus } from './task-status.enum';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('task')
@UseGuards(AuthGuard())
export class TaskController {
  private logger = new Logger('TaskController');
  constructor(private taskService: TaskService) {}

  @Get('list')
  getTaskList(@Query(ValidationPipe) filterDto: FilterTaskDTO, @GetUser() user: User): Promise<Task[]> {
    this.logger.debug(`User ${user.username} get all his tasks, filters: ${JSON.stringify(filterDto)}`);
    return this.taskService.getTaskListArray(filterDto, user);
  }

  @Get('/:id')
  getTaskByID(@Param('id', ParseIntPipe) taskId: number, @GetUser() user: User): Promise<Task> {
    return this.taskService.getTaskByID(taskId, user);
  }

  @Post('create')
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDTO, @GetUser() user: User): Promise<Task> {
    return this.taskService.createTask(createTaskDto, user);
  }

  @Delete('/:id')
  deleteTaskByID(@Param('id', ParseIntPipe) taskId: number, @GetUser() user: User): Promise<void> {
    return this.taskService.deleteTaskByID(taskId, user);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id', ParseIntPipe) taskId: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.updateTaskStatus(taskId, status, user);
  }
}
