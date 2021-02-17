import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/mysql-structure/auth/user.repository';
import { UserCredentialsDTO } from './dto/user-credentials.dto';
import { JWTPayloadInterface } from './jwt-payload.interface';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(userCredentials: UserCredentialsDTO): Promise<void> {
    return this.userRepository.signUp(userCredentials);
  }

  async signIn(userCredentials: UserCredentialsDTO): Promise<{ _token: string }> {
    this.logger.debug(`signIn: ${JSON.stringify(userCredentials)}`);

    const username = await this.userRepository.validateUserPassword(userCredentials);
    if (username == null) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JWTPayloadInterface = { username: userCredentials.username };
    const _token = await this.jwtService.sign(payload);
    return { _token };
  }
}
