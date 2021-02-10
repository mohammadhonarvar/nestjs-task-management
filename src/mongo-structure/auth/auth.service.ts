import { Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { genSalt } from 'bcrypt';
import { UserCredentialsDTO } from './dto/user-credentials.dto';
import { JWTPayloadInterface } from './jwt-payload.interface';
import { User, UserModel } from './user.schema';
@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectModel('User')
    private userModel: UserModel,
    private jwtService: JwtService,
  ) {}

  async signUp(userCredentials: UserCredentialsDTO): Promise<void> {
    const { username, password } = userCredentials;

    const newUser = new this.userModel();
    newUser.username = username;
    newUser.salt = await genSalt();
    newUser.password = await User.hashPassword(password, newUser.salt);

    try {
      await newUser.save();
    } catch (error) {
      this.logger.error(`Saving user error: ${JSON.stringify(error)}`);
      throw new InternalServerErrorException();
    }
  }

  async signIn(userCredentials: UserCredentialsDTO): Promise<{ _token: string }> {
    this.logger.debug(`signIn: ${JSON.stringify(userCredentials)}`);

    const user = await this.userModel.findOne({ username: userCredentials.username });
    this.logger.debug(`signIn: USER => ${JSON.stringify(user)}`);
    if (user == null || (await user.validatePassword(userCredentials.password)) === false) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JWTPayloadInterface = { username: user.username };
    const _token = await this.jwtService.sign(payload);
    return { _token };
  }
}
