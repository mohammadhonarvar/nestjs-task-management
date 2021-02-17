import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/mongo-typeorm/auth/user.entity';

export const typeOrmMysqlConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [__dirname + '/../**/*.entity.js'],
  synchronize: process.env.MYSQL_SYNCHRONIZE === 'TRUE' ? true : false,
};

export const typeOrmMongodbConfig: TypeOrmModuleOptions = {
  type: 'mongodb',
  host: process.env.MONGO_DB_URI_LOCAL,
  username: process.env.ME_CONFIG_MONGO_DB_USERNAME,
  password: process.env.ME_CONFIG_MONGO_DB_PASSWORD,
  database: process.env.MONGO_DB_NAME,
  entities: [User],
  synchronize: process.env.MONGO_DB_SYNCHRONIZE === 'TRUE' ? true : false,
};
