import './config/app-config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { typeOrmConfig } from './config/typeorm.config';
import { TaskModule } from './task/task.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    MongooseModule.forRoot(`${process.env.MONGO_DB_URI_LOCAL}/${process.env.MONGO_DB_NAME}`),
    TaskModule,
    AuthModule,
  ],
})
export class AppModule {}
