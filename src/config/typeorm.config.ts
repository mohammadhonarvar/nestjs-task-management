import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// import { User } from '../mongo-typeorm/auth/user.entity';
// import { Task } from '../mongo-typeorm/task/task.entity';

export const typeOrmMysqlConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST_LOCAL,
  port: parseInt(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [__dirname + '/../**/*.entity.js'],
  synchronize: process.env.MYSQL_SYNCHRONIZE === 'TRUE' ? true : false,
};

export const typeOrmMongodbConfig: TypeOrmModuleOptions = {
  type: 'mongodb',
  host: process.env.DB_HOST_LOCAL,
  database: process.env.MONGO_DB_NAME,
  entities: [__dirname + '/../**/*.entity.js'],
  synchronize: process.env.MONGO_DB_SYNCHRONIZE === 'TRUE' ? true : false,
};
