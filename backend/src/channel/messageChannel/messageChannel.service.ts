import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../entities/Channel.entity';
import { MChannel } from '../entities/MChannel.entity';
import { bannedUsers } from '../entities/bannedUsers.entity';
import { globalUtiles } from '../utiles/globalUtilse.service';
import { Repository } from 'typeorm';
import { UserService } from 'src/users/users.service';

@Injectable()
export class MessageChannelService {
	constructor(
		@InjectRepository(MChannel) private msg: Repository<MChannel>,
		public globalUtiles: globalUtiles,
		@InjectRepository(bannedUsers) private ban: Repository<bannedUsers>,
		@InjectRepository(Channel) private channel: Repository<Channel>,
		private readonly usersService: UserService,
	) { }

	async createMessage(userId: number, channelId: number, message_: string) {
		const found = await this.globalUtiles.findOneInRoomUser(userId, channelId);
		if (!found)
			throw new NotFoundException('user or channel not found');
		if (found.status !== 'accepted')
			throw new ForbiddenException('You must accept the invitation before sending messages.');
		
		const checkBan = await this.ban.findOne({
			where: {
				users: { id: userId },
				channel: { id: channelId }
			},
		});
		if (checkBan)
			throw new ForbiddenException('You are banned from this channel');

		if (!await this.globalUtiles.checkMuteUser(userId, channelId))
			throw new ForbiddenException(`User ${userId} has been muted for ${found.muteStartTimestamp} minutes.`);

		const message = message_.trim();
		if (!message) {
			throw new BadRequestException('message is empty');
		}
		if (message.length < 1)
			throw new BadRequestException('message is empty');
		const messages = await this.msg.save({
			message: message,
			users: { id: userId },
			channel: { id: channelId },
		});
		return messages;
	}

	async findAllMessage(channelId: number) {
		const getMessage = await this.channel.findOne({
			where: {
				id: channelId
			},
			relations: {
				messageChannel: {
					users: true
				},
			},
			select: {
				messageChannel: {
					id: true,
					message: true,
					createdAt: true,
					updatedAt: true,
					users: {
						id: true,
						username: true,
						displayName: true,
						Avatar_URL: true,
						status: true
					}
				}

			}
		});
		if (!getMessage)
			throw new NotFoundException('channel or message not found');
		const { password, ...reset } = getMessage;
		return reset
	}

	async findOneMessage(id: number) {
		try {
			const getMessage = await this.msg.findOne({
				where: {
					id,
				},
				relations: ['users', 'channel'],
				select: {
					id: true,
					message: true,
					channel: {
						id: true,
						title: true,
						type: true,
						createdAt: true,
						updatedAt: true,
					}
				}
			});
			if (!getMessage)
				throw new NotFoundException('message not found');
			return getMessage
		} catch (error) {
			throw error;
		}
	}

	async hideMessageFromUserBlocked(userId: number, channel: number) {
		const found = await this.globalUtiles.findOneInRoomUser(userId, channel);
		if (!found)
			throw new NotFoundException('user or channel not found');

		const findAllMessage = await this.findAllMessage(found.channel.id);

		if (!findAllMessage)
			throw new NotFoundException('no message found');

		const UserBlock = await this.usersService.getAllBlock(userId);
		const listIdBlocked = UserBlock.map((users) => users.Blocked_by_id !== userId ? users.Blocked_by_id : users.Blocked_one_id);

		const updatedData = { ...findAllMessage, messageChannel: [] };

		const ret = findAllMessage.messageChannel.filter((message) => {
			return !listIdBlocked.includes(message.users.id);
		})
		updatedData.messageChannel = ret
		return updatedData
	}
}
