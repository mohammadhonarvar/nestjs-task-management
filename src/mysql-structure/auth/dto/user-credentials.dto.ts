import { IsString, MaxLength, MinLength } from 'class-validator';

export class UserCredentialsDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(10)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;
}
