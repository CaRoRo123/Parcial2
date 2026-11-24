import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParkingSpotsService } from './parking-spots.service.js';
import { CreateParkingSpotDto } from './dto/create-parking-spot.dto.js';
import { UpdateParkingSpotDto } from './dto/update-parking-spot.dto.js';
import { AdminPolicy } from '../auth/policies/admin.policy.js';
import { Can } from '@nestjs/authorization';


@Can(AdminPolicy, 'manage')
@Controller('parking-spots')
export class ParkingSpotsController {
  constructor(private readonly parkingSpotsService: ParkingSpotsService) {}

  @Post()
  create(@Body() createParkingSpotDto: CreateParkingSpotDto) {
    return this.parkingSpotsService.create(createParkingSpotDto);
  }

}
