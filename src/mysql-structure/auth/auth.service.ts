import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCredentialsDTO } from './dto/user-credentials.dto';
import { JWTPayloadInterface } from './jwt-payload.interface';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(userCredentials: UserCredentialsDTO): Promise<void> {
    return this.userRepository.signUp(userCredentials);
  }

  async signIn(userCredentials: UserCredentialsDTO): Promise<{ _token: string }> {
    const username = await this.userRepository.validateUserPassword(userCredentials);

    if (username == null) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JWTPayloadInterface = { username: userCredentials.username };
    const _token = await this.jwtService.sign(payload);
    return { _token };
  }
}
