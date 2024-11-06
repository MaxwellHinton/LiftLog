// register user dto only contains the information that is required to sign up.
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsInt, Min, IsEmail, MinLength} from 'class-validator';

export class RegisterUserDto {
    @IsString()
    username:  string;

    @IsString()
    firstname: string;

    @IsString()
    lastname: string;

    @IsInt()
    @Min(14)
    age: number;

    @IsString()
    gender: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6) // minimum password length is 6
    password: string;
}