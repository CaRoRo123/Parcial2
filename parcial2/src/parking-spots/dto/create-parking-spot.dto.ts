import { IsString, IsNotEmpty, IsOptional} from 'class-validator';

import { ParkingSpot } from '../entities/parking-spot.entity.js';
const enum ChargerType {
    STANDARD = 'standard',
    ULTRAFAST = 'ultra_fast',
    FAST = 'fast'
}

export class CreateParkingSpotDto {
    @IsString()
    @IsNotEmpty()
    code: string;

    @IsString()
    @IsNotEmpty()
    charger_type: ChargerType;

    @IsString()
    @IsNotEmpty()
    id_supervisor: string;
}
