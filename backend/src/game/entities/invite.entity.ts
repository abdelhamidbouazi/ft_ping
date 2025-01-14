// game-history.entity.ts

import { Entity,BaseEntity , PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Invite_ extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user1 : string;

    @Column()
    user2 : string;

    @Column({ default: 0 })
    roomId : number;
}
