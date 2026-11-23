import { Entity, JoinTable } from 'typeorm';
import { Column } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { ManyToMany} from 'typeorm';
import { CreateDateColumn } from 'typeorm';
import { Role } from '../../roles/entities/role.entity.js';

@Entity('users')

export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @Column()
    name: string;

    @Column()
    phone?: string;

    @Column({default: true})
    is_active: boolean;
    
    @CreateDateColumn()
    created_at: Date;

    @ManyToMany(() => Role, (role) => role.users)
    @JoinTable({name: 'user_roles'})
    roles: Role[];
}


