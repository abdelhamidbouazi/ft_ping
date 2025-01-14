import { BadRequestException, ForbiddenException, Injectable, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from './entities/Channel.entity'
import { roomUsers } from './entities/RoomUsers.entity';
import { In, Not, Repository } from 'typeorm';
import { globalUtiles } from './utiles/globalUtilse.service';
import * as bcrypt from 'bcrypt';
import { MChannel } from './entities/MChannel.entity';
import { bannedUsers } from './entities/bannedUsers.entity';
import { UserService } from 'src/users/users.service';
import { AvatarUploadService } from 'src/users/upload/avatarupload.service';

@Injectable()
export class ChannelService {
	constructor(
		@InjectRepository(Channel) private channel: Repository<Channel>,
		@InjectRepository(MChannel) private message: Repository<MChannel>,
		@InjectRepository(roomUsers) private roomUser: Repository<roomUsers>,
		@InjectRepository(bannedUsers) private ban: Repository<bannedUsers>,
		private readonly usersService: UserService,
		private globalUtiles: globalUtiles,
		private readonly avatarUploadService: AvatarUploadService
	) { }

	async createRooms(channel: Channel, userId: number) {
		channel.title = channel.title.trim();
		if (channel.title.length <= 0)
			throw new BadRequestException('title is empty');
		const foundtitle = await this.globalUtiles.checkTitle(channel.title);
		const checkUser = await this.globalUtiles.findOneInUsers(userId);
		const checkType = await this.globalUtiles.checkTypeofChannel(channel);
		const pass = await this.globalUtiles.checkType(channel.type, channel.password);

		if (!checkUser)
			throw new NotFoundException('user not exist');
		if (foundtitle)
			throw new UnauthorizedException(`rooms '${channel.title}' already exist`);
		if (!checkType)
			throw new NotFoundException('type of channel not found');

		channel.password = pass;
		const CreateChannel = await this.channel.create(channel)
		await this.channel.save(CreateChannel)

		if (CreateChannel) {
			const owner = await this.roomUser.save({
				users: { id: userId },
				channel: { id: CreateChannel.id },
				role: 'owner',
				isMuted: false,
			});
			CreateChannel['ownerId'] = owner.users.id
			return CreateChannel;
		}
		throw new NotFoundException('channel not created');
	}

	async sendInvit(senderId: number, reseverId: number, channelId: number) {
		const resever = await this.globalUtiles.findOneInUsers(reseverId);
		if (!resever)
			throw new NotFoundException('USER NOT FOUND');

		const sender = await this.globalUtiles.findOneInRoomUser(senderId, channelId);
		if (!sender)
			throw new NotFoundException('sender not found')

		const isbaned = await this.globalUtiles.findOneInbannedUsers(reseverId, channelId);
		if (isbaned)
			throw new ForbiddenException('resever is baned by owner');

		const blockedByResever = await this.usersService.findReseverIfBlockedBySender(senderId, reseverId);
		if (blockedByResever)
			throw new ForbiddenException('this user is blocked you');

		const res = await this.globalUtiles.findOneInRoomUser(reseverId, channelId)
		if (!res) {
			await this.roomUser.save({
				users: { id: reseverId },
				channel: { id: channelId },
				role: 'member',
				isMuted: false,
				status: 'pending',
			});
			return `Invitation sent successfully to ${resever.username}`;
		}
		if (res.status === 'pending')
			throw new ForbiddenException('invitation already sent');
		if (res.status === 'accepted')
			throw new ForbiddenException('user already exist in this channel');
		if (res.status === 'rejected')
			throw new ForbiddenException('invitation already rejected');
	}

	async acceptInvit(userId: number, channelId: number) {
		const found = await this.globalUtiles.findOneInRoomUser(userId, channelId);
		if (!found)
			throw new NotFoundException('invitation not found');
		if (found.status === 'accepted')
			throw new ForbiddenException('invitation already accepted');
		if (found.status === 'rejected')
			throw new ForbiddenException('invitation already rejected');
		if (found.status === 'pending') {
			found.status = 'accepted';
			await this.roomUser.save(found);
			return `Invitation accepted successfully`;
		}
	}

	async leaveRoom(channelId: number, userId: number) {
		const user = await this.globalUtiles.findOneInRoomUser(userId, channelId);

		if (!user)
			throw new NotFoundException('this user or channel not found');

		if (user.role === 'admin' || user.role === 'member') {
			await this.roomUser.delete(user.id);
			return `User ${userId} has left room ${channelId}`;
		}

		if (user.role === 'owner') {

			const admin = await this.roomUser.findOne({
				where: {
					channel: { id: channelId },
					role: 'admin'
				},
				relations: ['users', 'channel'],
				select: {
					users: {
						id: true,
						username: true
					},
					channel: {
						id: true,
						type: true,
						title: true
					}
				}
			})

			if (admin) {
				admin.role = 'owner';
				await this.roomUser.delete(user.id)
				await this.roomUser.save(admin);
				return `User ${user.users.username} has left room ${admin.channel.title} successfully.`;
			}

			const member = await this.roomUser.findOne({
				where: {
					channel: { id: channelId },
					role: 'member',
				},
				relations: ['users', 'channel'],
				select: {
					users: {
						id: true,
						username: true
					},
					channel: {
						id: true,
						type: true,
						title: true
					}
				}
			})

			if (member) {
				member.role = 'owner';
				await this.roomUser.delete(user.id);
				await this.roomUser.save(member);
				return `User ${user.users.username} has left room ${member.channel.title} successfully.`;
			}

			if (!admin && !member) {
				await this.message.delete({ channel: { id: channelId } });
				await this.roomUser.delete(user.id)
				await this.globalUtiles.deletChannel(channelId);
				return `User ${user.users.username} has left room ${user.channel.title} successfully.`;
			}
		}
	}

	async getAllUserInChannel(channelId: number, userId: number) {
		const found = await this.globalUtiles.findOneInRoomUser(userId, channelId);
		if (!found)
			throw new NotFoundException('you are not a member of this channel');
		if (found && found.status !== 'accepted')
			throw new NotFoundException('you are not a member of this channel');

		const foundChannels = await this.roomUser.find({
			where: {
				channel: { id: channelId },
				status: "accepted"
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
				},
			}
		});
		return foundChannels;
	}

	async getBanedUsers(channelId: number, userId: number) {
		const found = await this.globalUtiles.findOneInRoomUser(userId, channelId);
		if (found && found.status !== 'accepted')
			throw new NotFoundException('you are not a accepted of this channel');
		if (!found)
			throw new NotFoundException('you are not a member of this channel');
		if (found.role !== 'owner' && found.role !== 'admin')
			throw new UnauthorizedException('you are not the administrator of this channel');
		const banedUsers = await this.ban.find({
			where: {
				channel: { id: channelId },
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
				},
			}
		})
		if (banedUsers.length <= 0)
			return []
		return banedUsers;
	}

	async getRooms(id: number) {
		const found = await this.globalUtiles.findOneInChannel(id)
		if (!found)
			throw new NotFoundException(`room '${id}' not found`);
		return found;
	}

	async getRooms_allusers(id: number) {
		const found = await this.globalUtiles.findALlusersInChannel(id)
		if (!found)
			throw new NotFoundException(`room '${id}' not found`);
		return found;
	}

	async getAll() {
		const found = await this.channel.find(
			{
				where: {
					type: In(["public", "protected"]),
				},
				select: {
					id: true,
					title: true,
					type: true,
					createdAt: true,
					updatedAt: true,
					Avatar_URL: true,
				}
			}
		);
		if (!found)
			throw new NotFoundException('rooms not found')
		return found;
	}

	async save_file_avatar(file: any, chan_id: number, userId: number) {
		if (!await this.globalUtiles.checkTypeAvatar(file.originalname))
			throw new NotAcceptableException('type of avatar not correct');

		const chan = await this.globalUtiles.findOneInRoomUser(userId, chan_id);
		if (chan && chan.status !== 'accepted')
			throw new NotFoundException('channel not found');

		if (chan.role !== 'owner' && chan.role !== 'admin') {
			throw new UnauthorizedException('you are not the owner of this channel')
		}

		const avatarURL = await this.avatarUploadService.uploadavatar(file);

		chan.channel.Avatar_URL = avatarURL;
		await this.channel.save(chan.channel);
		return 'avatar saved successfully';
	}

	async get_saved_avatar(chan_id: number): Promise<any> {
		const chan: Channel = await this.channel.findOne({ where: { id: chan_id } })
		return chan.Avatar_URL
	}

	async getmychannels(id: number) {
		return await this.roomUser.find({
			where: {
				users: { id }, status: "accepted"
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
				},
			}
		});
	}

	async joinChannelProtected(channelId: number, userId: number, password: string) {
		const checkHasBlocked = await this.globalUtiles.findOneInbannedUsers(userId, channelId);
		const checkUser = await this.globalUtiles.findOneInRoomUser(userId, channelId);

		const foundRoom = await this.channel.findOne({
			where: {
				id: channelId,
			},
		});

		if (!foundRoom)
			throw new NotFoundException(`room ${channelId} not found`);
		if (checkHasBlocked)
			throw new NotFoundException(`you have been baned by the administrator in this channel`);
		if (checkUser)
			throw new NotFoundException(`user ${userId} already exist`);

		if (foundRoom.type === 'private')
			throw new NotFoundException('this channel is not found');

		if (foundRoom.type === 'protected' && !password)
			throw new NotFoundException('password not found');
		if ((foundRoom.type === 'protected' && password)) {
			const isMatch = await bcrypt.compare(password, foundRoom.password);
			if (!isMatch)
				throw new ForbiddenException('password not correct')
		}
		await this.roomUser.save({
			users: { id: userId },
			role: 'member',
			channel: { id: channelId },
			isMuted: false,
		});
		const data = await this.globalUtiles.findOneInRoomUser(userId, channelId);
		return `User ${data.users.username} has joined room ${data.channel.title}.`;
	}

	async joinchannelPrivatePublic(channelId: number, userId: number) {
		const checkHasBlocked = await this.globalUtiles.findOneInbannedUsers(userId, channelId);
		const checkUser = await this.globalUtiles.findOneInRoomUser(userId, channelId);

		const foundRoom = await this.channel.findOne({
			where: {
				id: channelId,
			},
		});

		if (!foundRoom)
			throw new NotFoundException(`room ${channelId} not found`);
		if (checkHasBlocked)
			throw new NotFoundException(`you have been baned by the administrator in this channel`);
		if (checkUser)
			throw new NotFoundException(`user ${userId} already exist`);
		if (foundRoom.type === 'private')
			throw new NotFoundException('this channel is not found');

		await this.roomUser.save({
			users: { id: userId },
			role: 'member',
			channel: { id: channelId },
			isMuted: false,
		});
		const data = await this.globalUtiles.findOneInRoomUser(userId, channelId);
		return `User ${data.users.username} has joined room ${data.channel.title}.`;
	}

	async getlistmutedusers(userId: number, channelId: number) {
		const checkIfAdministrator = await this.globalUtiles.findOneInRoomUser(userId, channelId);
		if (!checkIfAdministrator)
			throw new NotFoundException('you are not a member of this channel');
		if (checkIfAdministrator && checkIfAdministrator.role !== 'admin' && checkIfAdministrator.role !== 'owner')
			throw new UnauthorizedException('you are not the administrator of this channel');
		const data = await this.roomUser.find({
			where: {
				channel: { id: channelId },
				status: "accepted",
				isMuted: true
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
				}, users:
				{
					id: true,
					username: true,
					nickname: true,
					displayName: true,
					Avatar_URL: true,
					status: true,
				}
			}

		});
		if (!data)
			throw new NotFoundException('no muted users');
		if (data.length <= 0)
			throw new NotFoundException('no muted users');
		const data_abouazi_want = [];
		data_abouazi_want.push(data[0].channel);
		for (const item of data) {
			item.users.role = item.role;
			data_abouazi_want.push(item.users)
		}
		return data_abouazi_want
	}

	async rejectedInvit(userId: number, channelId: number) {
		const found = await this.globalUtiles.findOneInRoomUser(userId, channelId);
		if (!found)
			throw new NotFoundException('invitation not found');
		if (found.status === 'accepted')
			throw new ForbiddenException('invitation already accepted');
		if (found.status === 'rejected')
			throw new ForbiddenException('invitation already rejected');
		if (found.status === 'pending') {
			await this.roomUser.remove(found);
			return "Invitation rejected successfully";
		}
	}

	async getlistinviteusers(userId: number) {
		const invit = await this.roomUser.find({
			where: {
				users: { id: userId },
				status: 'pending'
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
				}, users: {
					id: true,
					username: true,
					nickname: true,
					displayName: true,
					Avatar_URL: true,
					status: true,
				}
			}
		});
		if (!invit)
			throw new NotFoundException('no invite');
		return invit
	}

	async getchannel(id: number) {
		const userChannels = await this.roomUser.find({
			where: {
				users: { id: id }
			},
			relations: ['channel', 'users'],
		});

		const userChannelIds = userChannels.map((roomUser) => roomUser.channel.id);
		const found = await this.roomUser.find({
			where: {
				channel: Not(In(userChannelIds))
			},
			relations: ['channel'],
		});

		const channeId = found.map((roomUser) => roomUser.channel.id);

		const getchannel = await this.channel.find({
			where: {
				id: In(channeId),
				type: In(["public", "protected"]),
			},
			select: {
				id: true,
				title: true,
				Avatar_URL: true,
				type: true,
				createdAt: true,
				updatedAt: true,
			}
		});
		return getchannel
	}
}
