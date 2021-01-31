import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// import { AuthModule } from '../auth/auth.module';
import { TaskController } from './task.controller';
import { taskSchema } from './task.schema';
import { TaskService } from './task.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Task',
        schema: taskSchema,
      },
    ]),
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
