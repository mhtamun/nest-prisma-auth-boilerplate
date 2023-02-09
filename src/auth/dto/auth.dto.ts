import { IsEmail, IsNotEmpty } from "class-validator";

export class AuthDto{
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;
}