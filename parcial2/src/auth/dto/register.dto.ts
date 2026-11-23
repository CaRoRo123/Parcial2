import {IsString, IsNotEmpty,IsOptional,IsEmail} from "class-validator";

export class RegisterDto {
    @IsEmail({},{"message": "email invÃ¡lido"

    })
    @IsNotEmpty({"message": "el email es requerido"})
    email: string;

    @IsString({"message": "password invÃ¡lido"})
    @IsNotEmpty({"message": "el password es requerido"})
    password: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    phone?: string;

}
