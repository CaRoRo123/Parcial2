import { ConflictException, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto.js';
import { UpdateReservationDto } from './dto/update-reservation.dto.js';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity.js';
import { ParkingSpot } from '../parking-spot/entities/parking-spot.entity.js';

@Injectable()
export class ReservationsService {
  getRole(user: any) {
    return user?.role;
  }
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ParkingSpot)
    private readonly parkingSpotRepository : Repository<ParkingSpot>,
  ) {}

  async create(createReservationDto: CreateReservationDto) {
    const puesto = await this.parkingSpotRepository.findOne({
      where: { id_parking_spot: createReservationDto.id_parking_spot },
    });

    const tipoCarga  = await this.parkingSpotRepository.findOne({
      where: { charger_type: puesto.charger_type as unknown as ParkingSpot['charger_type'] },
    });
    if(tipoCarga !== createReservationDto.vehicle_max_charge) {
      throw new ConflictException ('Charger type mismatch');
    }

    const reservation = this.reservationRepository.create(createReservationDto);
    return this.reservationRepository.save(reservation);
  }

  findAll() {
    const role = this.getRole(user);
    if (role === 'admin') {
      return this.reservationRepository.find();
    } else {
      return this.reservationRepository.find({
        where: { user: { id: user.id } },
      });
    }
  }

  

  async update(id: number, updateReservationDto: UpdateReservationDto) {
  
    return this.reservationRepository.update(id, updateReservationDto);
  }

  async remove(id: number, body: any) {
    const id_usuario = await this.reservationRepository.findOne({
      where: { id: id },
      select: ['user'],
    });
    if (id_usuario.user.id !== body.user.id) {
      throw new ConflictException('User mismatch');
    }
    return this.reservationRepository.delete(id);
  }
}
