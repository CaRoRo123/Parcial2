import { ParkingSpot } from './entities/parking-spot.entity.js';
import { CreateParkingSpotDto } from './dto/create-parking-spot.dto.js';
import { UpdateParkingSpotDto } from './dto/update-parking-spot.dto.js';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class ParkingSpotsService {
  constructor(
    @InjectRepository(ParkingSpot)
    private readonly parkingSpotsRepository: Repository<ParkingSpot>,
  ) {}

  async create(createParkingSpotDto: CreateParkingSpotDto) {
    const existingSpot = await this.parkingSpotsRepository.findOne({
      where: { code: createParkingSpotDto.code },
    });
    if (existingSpot) {
      throw new ConflictException('Parking spot already exists');
    }
    
    const newSpot = this.parkingSpotsRepository.create(createParkingSpotDto);
    return this.parkingSpotsRepository.save(newSpot);
  }

}
