import { IsString, IsNotEmpty, IsOptional} from 'class-validator';

const enum ChargerType {
    STANDARD = 'standard',
    ULTRAFAST = 'ultra_fast',
    FAST = 'fast'
}
const enum status {
    PENDING = 'pending',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}
export class CreateReservationDto {

    @IsString()
    @IsNotEmpty()
    id_parking_spot: string;

    @IsString()
    @IsNotEmpty()
    id_user: string;


    @IsString()
    @IsNotEmpty()
    vehicle_plate: string;

    @IsString()
    @IsNotEmpty()
    vehicle_max_charge: ChargerType;

    @IsString()
    @IsOptional()
    status?: status;
}
