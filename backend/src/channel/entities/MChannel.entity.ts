import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Channel } from "./Channel.entity";
import { IsNotEmpty } from "class-validator";

import { User } from "src/users/entities/user.entity";
@Entity()
export class MChannel {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	@IsNotEmpty()
	message: string;

	@CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
	createdAt: Date;

	@UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
	updatedAt: Date;

	@ManyToOne(() => User, users => users.messageChannel)
	users: User;

	@ManyToOne(() => Channel, channel => channel.messageChannel)
	channel: Channel;
}