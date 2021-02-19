import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWTPayloadInterface } from './jwt-payload.interface';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'jwtTest1',
    });
  }

  async validate(payload: JWTPayloadInterface): Promise<User> {
    const user = await this.userRepository.findOne({ username: payload.username });
    if (user == null) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
