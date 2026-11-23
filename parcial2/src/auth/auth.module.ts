import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from '@nestjs/authentication';
import { User } from '../users/entities/user.entity.js';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { AppJwtBearerProvider } from './jwt-bearer.provider.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthenticationModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        accessToken: {
          key: config.get<string>('JWT_SECRET')!,
          expiresIn: (config.get<string>('JWT_EXPIRES_IN') || '2m') as any,
        },
        refreshToken: {
          ttl: (config.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d') as any,
        },
        allowInMemoryStorage: true
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AppJwtBearerProvider],
  exports: [AuthenticationModule],
})
export class AuthModule {}
