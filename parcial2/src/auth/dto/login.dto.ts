import {IsEmail, IsNotEmpty, IsString} from 'class-validator';

export class LoginDto {
    @IsEmail({}, {"message": "email invÃ¡lido"})
    @IsNotEmpty({"message": "el email es requerido"})
    email: string;

    @IsString({"message": "password invÃ¡lido"})
    @IsNotEmpty({"message": "el password es requerido"})
    password: string;
}
