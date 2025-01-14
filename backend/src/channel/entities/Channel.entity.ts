import { IsNotEmpty, MaxLength, MinLength } from "class-validator";
import { bannedUsers } from "./bannedUsers.entity";
import { roomUsers } from "./RoomUsers.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { MChannel } from "./MChannel.entity";

@Entity()
export class Channel {

	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: true })
	Avatar_URL: string;

	@Column()
	@MaxLength(20, { message: 'title is too long' })
	@MinLength(1, { message: 'title is too short' })
	@IsNotEmpty()
	title: string;

	@Column()
	@IsNotEmpty()
	type: string;

	@Column()
	password: string;

	@CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
	createdAt: Date;

	@UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
	updatedAt: Date;

	@OneToMany(() => roomUsers, roomUsers => roomUsers.channel)
	roomUsers: roomUsers[];

	@OneToMany(() => MChannel, messageChannel => messageChannel.channel)
	messageChannel: MChannel[];

	@OneToMany(() => bannedUsers, bannedUsers => bannedUsers.channel)
	bannedUsers: bannedUsers[];
}