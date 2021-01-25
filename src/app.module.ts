import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { typeOrmConfig } from './config/typeorm.config';
import { TaskModule } from './task/task.module';
@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), TaskModule, AuthModule],
})
export class AppModule {}
