import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AuthenticationRegistry,
  JwtBearerProvider,
  type JwtClaims,
} from '@nestjs/authentication';
import { User } from '../users/entities/user.entity.js';

@Injectable()
export class AppJwtBearerProvider extends JwtBearerProvider<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    registry: AuthenticationRegistry,
  ) {
    super();
    registry.registerProvider(this, { order: 1 });
  }

  async validate({ sub }: JwtClaims): Promise<User | null> {
    if (!sub) return null;

    if (!/^[0-9a-f-]{36}$/i.test(sub)) return null;

    const user = await this.userRepository.findOne({
      where: { id: sub },
      relations: { roles: true },
    });

    if (!user || !user.is_active) return null;
    return user;
  }
}

