import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWTPayloadInterface } from './jwt-payload.interface';
import { User, UserModel } from './user.schema';
// import { UserRepository } from './user.repository';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel('User')
    private userModel: UserModel,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'jwtTest1',
    });
  }

  async validate(payload: JWTPayloadInterface): Promise<User> {
    const user = await this.userModel.findOne({ username: payload.username });
    if (user == null) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
