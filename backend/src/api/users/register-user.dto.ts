// register user dto only contains the information that is required to sign up.
// /src/api/users/register-user.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  IsEmail,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsInt()
  @Min(14)
  @IsNotEmpty()
  age: number;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6) // minimum password length is 6
  password: string;
}
