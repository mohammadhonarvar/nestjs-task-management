import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { UserCredentialsDTO } from './dto/user-credentials.dto';
import { User } from './user.entity';
import { genSalt, hash } from 'bcrypt';
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(userCredentials: UserCredentialsDTO) {
    const { username, password } = userCredentials;

    const newUser = new User();
    newUser.username = username;
    newUser.salt = await genSalt();
    newUser.password = await this.hashPassword(password, newUser.salt);

    try {
      await newUser.save();
    } catch (error) {
      console.log(error);
      if (Number(error.errno) === 1062) {
        throw new ConflictException(`This username('${username}') is exist now`);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(userCredentials: UserCredentialsDTO): Promise<string> {
    const user = await this.findOne({ username: userCredentials.username });
    if (user != null && (await user.validatePassword(userCredentials.password))) {
      return user.username;
    }

    return null;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return await hash(password, salt);
  }
}
