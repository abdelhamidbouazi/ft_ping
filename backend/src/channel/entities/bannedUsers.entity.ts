import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Channel } from "./Channel.entity";
import { User } from "src/users/entities/user.entity";


@Entity()
export class bannedUsers {

	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Channel, channel => channel.bannedUsers)
	channel: Channel;

	@ManyToOne(() => User, users => users.bannedUsers)
	users: User;
}