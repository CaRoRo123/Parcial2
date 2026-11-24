import { PartialType } from '@nestjs/mapped-types';
import { CreateParkingSpotDto } from './create-parking-spot.dto.js';
import { IsString } from 'class-validator';

const enum status {
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}
export class UpdateParkingSpotDto  
{
    @IsString()
    status?: status;

}
