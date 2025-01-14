// room.entity.ts

import { Entity, BaseEntity , PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Room extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    status: string;

    @Column()
    type: string;

    @Column({ default: 0 })
    socket : number;

}
