import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
import { TaskStatus } from './task-status.enum';

export interface TaskInterface {
  title: string;
  description: string;
  status: TaskStatus;
}

export type TaskDocument = TaskInterface & Document;

export type TaskModel = Model<TaskDocument>;

@Schema({
  collection: 'task',
})
export class Task {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({
    type: String,
    enum: [TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE],
    default: TaskStatus.OPEN,
  })
  status: string;
}

export const taskSchema = SchemaFactory.createForClass(Task);
