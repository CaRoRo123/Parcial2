import { IsString, IsNotEmpty} from 'class-validator';


export class CreateRoleDto {

    @IsString()
    @IsNotEmpty({message: 'role_name es requerido'})
    role_name: string;

    @IsString()
    description?: string;   

}


