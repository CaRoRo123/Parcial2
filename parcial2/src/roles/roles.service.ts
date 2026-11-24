import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity.js';
import { CreateRoleDto } from './dto/create-role.dto.js';
import { UpdateRoleDto } from './dto/update-role.dto.js';

@Injectable()
export class RolesService {
  constructor(@InjectRepository(Role) private readonly roleRepository: Repository<Role>) {}

  async create(dto: CreateRoleDto) {
    const exists = await this.roleRepository.findOne({ where: { role_name: dto.role_name } });
    if (exists) throw new ConflictException(`'${dto.role_name}' ya existe`);
    const role = await this.roleRepository.save(this.roleRepository.create(dto));
    
    return { message: 'Rol creado con éxito', roleId: role.id };
  }

  findAll() {
    return this.roleRepository.find({ select: { id: true, role_name: true, description: true } });
  }

  async findOne(id: string) {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) throw new NotFoundException(`Rol con id ${id} no encontrado`);
    return role;
  }

  async update(id: string, dto: UpdateRoleDto) {
    const role = await this.findOne(id);
    Object.assign(role, dto);
    return this.roleRepository.save(role);
  }

  async remove(id: string) {
    const role = await this.findOne(id);
    await this.roleRepository.remove(role);
    return { message: 'Rol eliminado' };
  }
}

