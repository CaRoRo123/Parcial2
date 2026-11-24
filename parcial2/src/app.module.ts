import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {User} from './users/entities/user.entity.js';
import {Role} from './roles/entities/role.entity.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { RolesModule } from './roles/roles.module.js';
export const { ObserveModule, ObserveInstrument } = createObserveModule();
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from '@nestjs/authentication';
import { AuthorizationGuard,AuthorizationModule } from '@nestjs/authorization';
import { AdminPolicy } from './auth/policies/admin.policy.js';
import { ParkingSpotsModule } from './parking-spots/parking-spots.module.js';
import { ReservationsModule } from './reservations/reservations.module.js';
import { ParkingSpotsModule } from './parking-spots/parking-spots.module.js';

@Module({
  imports: [
    AuthorizationModule.forRoot(),
    TypeOrmModule.forFeature([User, Role]), //meter aca los que se creen luego :)
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],  
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
    }),
  }),
    AuthModule,
    UsersModule,
    RolesModule,
    ParkingSpotsModule,
    ReservationsModule,
],
  controllers: [AppController],
  providers: [AppService, AdminPolicy, { provide: APP_GUARD, useClass: AuthenticationGuard }, { provide: APP_GUARD, useClass: AuthorizationGuard }],
})
export class AppModule {}

