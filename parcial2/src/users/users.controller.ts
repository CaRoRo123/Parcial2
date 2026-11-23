import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { User } from './entities/user.entity.js';
import {Can} from '@nestjs/authorization';
import { AdminPolicy } from '../auth/policies/admin.policy.js';
import { AsignarRolesDTO} from './dto/asignar-roles.dto.js';
import { CurrentUser } from '@nestjs/authentication';

@Can(AdminPolicy, 'manage')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Can.Anyone()
  @Get('me')
  getMe(@CurrentUser() user: User) {
    const { id, email, name, phone, roles } = user;
    return { id, email, name, phone, roles };

  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id/roles')
  async asignarRoles(@Param('id') id: string, @Body() asignarRolesDto: AsignarRolesDTO) {
    return this.usersService.asignarRoles(id, asignarRolesDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}


