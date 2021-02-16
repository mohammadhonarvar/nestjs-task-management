import { hash } from 'bcrypt';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';

export interface UserInterface {
  username: string;
  password: string;
  salt: string;
  // taskList: TaskInterface[];
}

export interface UserDocument extends UserInterface, Document {
  validatePassword: (password: string) => Promise<boolean>;
}

export type UserModel = Model<UserDocument>;

@Schema({
  collection: 'user',
  versionKey: false,
})
export class User {
  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true })
  salt: string;

  static async hashPassword(password: string, salt: string): Promise<string> {
    return await hash(password, salt);
  }
}

export const userSchema = SchemaFactory.createForClass(User);

userSchema.methods.validatePassword = async function (password: string): Promise<boolean> {
  const user = (this as unknown) as UserDocument;
  // console.info('validatePassword: %o', user);
  const hashPassword = await hash(password, user.salt);
  return hashPassword === user.password;
};

userSchema.post('save', function (error, doc, next) {
  console.error('ERROR IN SCHEMA: %o', error);

  if (error.name === 'MongoError' && error.code === 11000) {
    throw new ConflictException(`Username: ('${doc.username}') is exist now`);
    // next(new Error('email must be unique'));
  } else {
    throw new InternalServerErrorException();
    // next(error);
  }
});
