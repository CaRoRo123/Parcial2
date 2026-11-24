import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { ParkingSpot } from '../../parking-spots/entities/parking-spot.entity.js';
import { User } from '../../users/entities/user.entity.js';
import { IsEnum } from 'class-validator';
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
@Entity('reservations')
export class Reservation {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => ParkingSpot, (parkingSpot) => parkingSpot.id)
    @Column({type: 'uuid', nullable: false})
    id_parking_spot: string;

    @ManyToOne(() => User, (user) => user.id)
    @Column({type: 'uuid', nullable: false})
    id_user: string;


    @CreateDateColumn()
    created_at: Date;

    @Column({nullable: false})
    vehicle_plate: string;

    @Column({nullable: false})
    vehicle_max_charge: ChargerType;

    @Column({nullable: false, default: status.PENDING})
    status: status;

}
