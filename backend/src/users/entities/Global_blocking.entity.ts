import { Entity, PrimaryGeneratedColumn, Column, } from "typeorm"
@Entity()
export class Global_blocking {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    Blocked_by_id: number
    @Column()
    Blocked_one_id: number
}
