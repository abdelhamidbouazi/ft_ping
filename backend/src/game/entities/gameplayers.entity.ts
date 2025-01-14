import { Entity,BaseEntity , PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Room } from './room.entity';


@Entity()
export class GamePlayers extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    number: number;

    @Column()
    score: string;

    @Column()
    socket : string[];

    @ManyToOne(() => Room)
    room  : Room
}
