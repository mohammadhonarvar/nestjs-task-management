import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: 'task-management',
  entities: [__dirname + '/../**/*.entity.js'],
  synchronize: process.env.MYSQL_SYNCHRONIZE === 'TRUE' ? true : false,
};
