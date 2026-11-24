import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReservationsService } from './reservations.service.js';
import { CreateReservationDto } from './dto/create-reservation.dto.js';
import { UpdateReservationDto } from './dto/update-reservation.dto.js';
import { ReservationPolicy } from '../auth/policies/reservation.policy.js';
import { Can } from '@nestjs/authorization';
import { AdminPolicy } from '../auth/policies/admin.policy.js';
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}
  
  
  @Can(ReservationPolicy,'create')
  @Post()
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationsService.create(createReservationDto);
  }
  
  @Can.Anyone()
  @Get()
  findAll() {
    return this.reservationsService.findAll();
  }


  @Can(ReservationPolicy,'update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReservationDto: UpdateReservationDto) {
    return this.reservationsService.update(+id, updateReservationDto);
  }
  
  @Can(ReservationPolicy,'delete')
  @Delete(':id')
  remove(@Param('id') id: string, @Body() body: any) {
    return this.reservationsService.remove(+id);
  }
}
