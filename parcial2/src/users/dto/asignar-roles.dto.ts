import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class AsignarRolesDTO {
  @IsArray({ message: 'roles invÃ¡lidos' })
  @ArrayNotEmpty({ message: 'roles invÃ¡lidos' })
  @IsString({ each: true, message: 'roles invÃ¡lidos' }) 
  roles: string[];
}
