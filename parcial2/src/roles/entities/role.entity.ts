import { Entity } from 'typeorm';
import { Column } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { ManyToMany} from 'typeorm';
import { CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity.js';

@Entity('roles')
export class Role {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({unique: true})
    role_name: string;

    @Column()
    description?: string;

    @CreateDateColumn()
    created_at: Date;

    @ManyToMany(() => User, (user) => user.roles)
    users: User[];
}



