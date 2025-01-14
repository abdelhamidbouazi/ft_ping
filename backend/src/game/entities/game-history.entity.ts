// game-history.entity.ts

import { Entity,BaseEntity , PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class GameHistory extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    player1: string;

    @Column()
    player2: string;

    @Column()
    score_player1: number;

    @Column()
    score_player2: number;
    @Column({nullable:true})
    player1_avatar: string;
    @Column({nullable:true})
    player2_avatar: string;
    
}
