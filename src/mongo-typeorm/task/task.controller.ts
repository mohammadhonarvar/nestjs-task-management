import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
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
// import { Task } from './task.schema';
import { AuthGuard } from '@nestjs/passport';
import { TaskDocument } from './task.schema';
import { TaskIdValidationPipe } from './pipe/task-id-validation.pipe';
import { FilterTaskValidationPipe } from './pipe/filter-task-validation.pipe';
import { GetUser } from '../auth/get-user.decorator';
import { UserDocument } from '../auth/user.schema';

@Controller('task')
@UseGuards(AuthGuard())
export class TaskController {
  private readonly logger = new Logger('TaskController');

  constructor(private readonly taskService: TaskService) {}

  @Get('list')
  getTaskList(
    @Query(ValidationPipe, FilterTaskValidationPipe) filterTaskDTO: FilterTaskDTO,
    @GetUser() user: UserDocument,
  ): Promise<TaskDocument[]> {
    this.logger.debug(`User ${user.username} get all his tasks, filters: ${JSON.stringify(filterTaskDTO)}`);
    return this.taskService.getTaskListArray(filterTaskDTO, user);
  }

  @Get('/:id')
  getTaskByID(
    @Param('id', TaskIdValidationPipe) taskId: string,
    @GetUser() user: UserDocument,
  ): Promise<TaskDocument> {
    return this.taskService.getTaskByID(taskId, user);
  }

  @Post('create')
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDTO, @GetUser() user: UserDocument): Promise<TaskDocument> {
    return this.taskService.createTask(createTaskDto, user);
  }

  @Delete('/:id')
  deleteTaskByID(
    @Param('id', TaskIdValidationPipe) taskId: string,
    @GetUser() user: UserDocument,
  ): Promise<void> {
    return this.taskService.deleteTaskByID(taskId, user);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id', TaskIdValidationPipe) taskId: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: UserDocument,
  ): Promise<TaskDocument> {
    return this.taskService.updateTaskStatus(taskId, status, user);
  }
}
