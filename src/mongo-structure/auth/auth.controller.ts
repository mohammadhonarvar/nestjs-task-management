import { Body, Controller, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserCredentialsDTO } from './dto/user-credentials.dto';
import { GetUser } from './get-user.decorator';
import { User } from './user.schema';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sign-up')
  signUp(@Body(ValidationPipe) userCredentials: UserCredentialsDTO): Promise<void> {
    return this.authService.signUp(userCredentials);
  }

  @Post('/sign-in')
  signIn(@Body(ValidationPipe) userCredentials: UserCredentialsDTO): Promise<{ _token: string }> {
    return this.authService.signIn(userCredentials);
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  test(@GetUser() user: User) {
    console.log(user);
  }
}
