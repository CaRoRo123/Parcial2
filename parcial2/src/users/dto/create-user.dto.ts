import { IsString, IsEmail, IsNotEmpty ,IsBoolean} from 'class-validator';


export class CreateUserDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
 
    @IsString()
    @IsNotEmpty()
    name: string;   

    @IsString()
    phone?: string;

    @IsBoolean()
    isActive: boolean;
}


