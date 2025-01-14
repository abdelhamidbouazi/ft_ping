import { IsNotEmpty } from "class-validator";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Channel } from "./Channel.entity";
import { User } from "src/users/entities/user.entity";

@Entity()
export class roomUsers {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, users => users.roomUsers)
	users: User;

	@ManyToOne(() => Channel, (channel) => channel.roomUsers)
	channel: Channel;

	@Column()
	@IsNotEmpty()
	role: string;

	@Column({ default: "accepted"})
	status: string;

	@Column({ default: "0" })
	muteStartTimestamp: string;

	@Column()
	isMuted: boolean;
}
