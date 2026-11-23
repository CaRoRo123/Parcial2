import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { User } from './entities/user.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../roles/entities/role.entity.js';
import { AsignarRolesDTO } from './dto/asignar-roles.dto.js';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create({ email: createUserDto.email, password: createUserDto.password, name: createUserDto.name, phone: createUserDto.phone, is_active: createUserDto.isActive });
    const saved = await this.userRepository.save(user);
    const { password: _password, ...safeUser } = saved;
    return safeUser;
  }

  findAll() {
    return this.userRepository.find({ relations: { roles: true }, select: { id: true, email: true, name: true, roles: { id: true, role_name: true, description: true } } });
  }

  findOne(id: string) {
    return this.userRepository.findOne({ where: { id }, relations: { roles: true } });
  }

  async asignarRoles(id: string, rolesEntrada: AsignarRolesDTO) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario no encontrado`);
    }
    const roles = await this.roleRepository.find();
    const uniqueRoles = [...new Set(rolesEntrada.roles)];
    const rolesAsignar = [];
    for (const role of uniqueRoles) {
      const roleEntity = roles.find(r => r.role_name === role);
      if (!roleEntity) {
        throw new BadRequestException(`Roles invalidos`);
      }
      rolesAsignar.push(roleEntity);
    }
    user.roles = rolesAsignar;
    await this.userRepository.save(user);
    return { message: 'Roles asignados' };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    Object.assign(user, updateUserDto);
    const saved = await this.userRepository.save(user);
    const { password: _password, ...safeUser } = saved;
    return safeUser;
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    await this.userRepository.remove(user);
    return { message: 'Usuario eliminado' };
  }
}


