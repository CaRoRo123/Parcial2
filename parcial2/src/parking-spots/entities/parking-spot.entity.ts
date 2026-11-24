import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Column } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { ManyToMany} from 'typeorm';
import { CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { IsOptional, IsUUID } from 'class-validator';

const enum ChargerType {
    STANDARD = 'standard',
    ULTRAFAST = 'ultra_fast',
    FAST = 'fast'
}

@Entity('parking_spots')
export class ParkingSpot {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({unique: true, nullable: false})
    code: string;

    @Column({type: 'enum', nullable : false})
    charger_type: ChargerType;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'id_supervisor' })
    @IsUUID()
    @Column({type: 'uuid',nullable: false})
    supervisor: string;

    @CreateDateColumn()
    created_at: Date;

}
