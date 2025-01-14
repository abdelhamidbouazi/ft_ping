import { BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Channel } from "../entities/Channel.entity";
import { bannedUsers } from "../entities/bannedUsers.entity";
import { roomUsers } from "../entities/RoomUsers.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { User } from "src/users/entities/user.entity";

export enum ChannelType {
	private,
	public,
	protected
};

export class globalUtiles {
	constructor(
		@InjectRepository(Channel) private channel: Repository<Channel>,
		@InjectRepository(roomUsers) private roomUser: Repository<roomUsers>,
		@InjectRepository(bannedUsers) private UserBlock: Repository<bannedUsers>,
		@InjectRepository(User) private users: Repository<User>,
	) { }

	async checkMuteUser(userId: number, channelId: number): Promise<boolean> {
		const user = await this.findOneInRoomUser(userId, channelId);
		const timeNow = Math.floor(parseInt(new Date().getTime().toString()) / 1000);

		if (!user.isMuted)
			return true;
		if (parseInt(user.muteStartTimestamp) - timeNow <= 0) {
			await this.roomUser.update(user.id, {
				isMuted: false,
				muteStartTimestamp: '0',
			});
			return true;
		}
		return false;
	}

	async findOneInRoomUser(userId: number, channelId: number) {
		try{
			return await this.roomUser.findOne({
				where: {
					users: { id: userId },
					channel: { id: channelId }
				},
				relations: ['users', 'channel'],
				select: {
					users: {
						id: true,
						username: true,
					},
					channel: {
	
						id: true,
						title: true,
						Avatar_URL: true,
						type: true,
						createdAt: true,
						updatedAt: true,
						messageChannel: {
							id: true,
							message: true,
						}
					},
				}
			});}
			catch(error){
				// //console.log(error, "error hna")
			}
		
	}

	async findOneInbannedUsers(userId: number, channelId: number) {
		try {
			return await this.UserBlock.findOne({
				where: {
					users: { id: userId },
					channel: { id: channelId }
				},
				relations: ['users', 'channel'],
				select: {
					users: {
						id: true,
						username: true,
					},
					channel: {
						id: true,
						title: true,
						Avatar_URL: true,
						type: true,
						createdAt: true,
						updatedAt: true,
					},
				}
			});
		} catch (error) {
			throw error;
		}
	}

	async findOneInUsers(userId: number) {
		return await this.users.findOne({
			where: {
				id: userId,
			},
			select: {
				id: true,
				username: true,
				Avatar_URL: true,
				nickname: true,
				displayName: true,
				status: true,
				achievements: true,
			}
		})
	}

	async findOneInChannel(channelId: number) {
		return await this.channel.findOne({
			where: {
				id: channelId,
			},
			select: {
				id: true,
				title: true,
				Avatar_URL: true,
				type: true,
				createdAt: true,
				updatedAt: true,
			}
		})
	}


	async findALlusersInChannel(channelId: number) {
		const data: roomUsers[] = await this.roomUser.find({
			where: {
				channel: { id: channelId }, status: "accepted"
			},
			relations: ['users', 'channel'],
			select: {
				channel: {

					id: true,
					title: true,
					Avatar_URL: true,
					type: true,
					createdAt: true,
					updatedAt: true,
				}
				, users: {

					id: true,
					username: true,
					Avatar_URL: true,
					nickname: true,
					displayName: true,
					status: true,
				},

			}

		})
		const data_abouazi_want = [];
		data_abouazi_want.push(data[0].channel);
		for (const item of data) {
			item.users.role = item.role;
			data_abouazi_want.push(item.users)
		}
		return data_abouazi_want
	}


	async findOneInUserBlock(userId: number, channelId: number) {
		return await this.UserBlock.findOne({
			where: {
				channel: { id: channelId },
				users: { id: userId },
			},
			relations: ['users', 'channel'],
			select: {
				users: {
					id: true,
					username: true,
					Avatar_URL: true,
					nickname: true,
					displayName: true,
					status: true,
					achievements: true,
				},
				channel: {
					id: true,
					title: true,
					Avatar_URL: true,
					type: true,
					createdAt: true,
					updatedAt: true,
				},
			}
		})
	}

	async checkTypeofChannel(channel: Channel) {
		for (let i = 0; ChannelType[i]; i++) {
			if (ChannelType[i] === channel.type) {
				return true;
			}
		}
		return false;
	}

	async checkType(type: string, password_: string): Promise<string> {
		if (type === "protected") {
			if (!password_) {
				throw new BadRequestException('password is required');
			}
			if (password_ === undefined) {
				throw new BadRequestException('password is required');
			}
			const password = password_.toString();
			if (password.length < 1 || password.length > 16) {
				throw new BadRequestException('Password must be 8-16 characters long');
			}
			if (password.includes(' ')) {
				throw new BadRequestException('Password must not contain spaces');
			}
			const saltOrRounds = 10;
			return await bcrypt.hash(password, saltOrRounds);
		}
		return '';
	}

	async checkTitle(title: string) {
		return await this.channel.findOne({
			where: {
				title: title,
			},
		});

	}

	async deletChannel(id: number) {
		const foundchannel = await this.channel.findOne({
			where: {
				id,
			}
		});
		if (foundchannel) {
			await this.channel.delete(foundchannel.id);
			return `channel ${id} deleted successfully`;
		}
		throw new NotFoundException(`channel ${id} not found`)
	}

	async checkTypeAvatar(image: string) {
		const validImage = ['jpg', 'jpeg', 'png', 'gif', 'svg'];
		const extension = image.substring(image.lastIndexOf(".") + 1).toLowerCase();
		return validImage.includes(extension);
	}

	async checkType_(type: string) {
		for (let i = 0; ChannelType[i]; i++) {
			if (ChannelType[i] === type) {
				return true;
			}
		}
		return false;
	}

	async hashPassword(password_: string) {
		const password = password_.toString();
		if (password == undefined || password == null) {
			throw new NotFoundException('password is required');
		}
		if (password.length < 1 || password.length > 16) {
			throw new NotFoundException('Password must be 8-16 characters long');
		}

		const saltOrRounds = 10;
		return await bcrypt.hash(password, saltOrRounds);
	}
}

