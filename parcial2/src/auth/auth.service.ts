import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordHasher, TokenService } from '@nestjs/authentication';
import { User } from '../users/entities/user.entity.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email ya registrado');
    }

    const hashedPassword = await this.passwordHasher.hash(dto.password);

    const user = this.userRepository.create({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
      phone: dto.phone,
    });

    const saved = await this.userRepository.save(user);
    return {
      message: 'Usuario registrado con éxito',
      userId: saved.id,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      relations: { roles: true },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const isValid = await this.passwordHasher.verify(dto.password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    if (!user.is_active) {
      throw new HttpException('Usuario desactivado', HttpStatus.LOCKED); // 423 Locked
    }

    const tokens = await this.tokenService.issue(String(user.id), {
      claims: { email: user.email },
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: 120,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const tokens = await this.tokenService.refresh(refreshToken);
      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: 120,
      };
    } catch {
      throw new UnauthorizedException('Refresh token inválido, ya usado o revocado');
    }
  }

  async logout(refreshToken: string) {
    await this.tokenService.revoke(refreshToken);
  }
}
