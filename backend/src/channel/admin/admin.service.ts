import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Channel } from "../entities/Channel.entity";
import { MChannel } from "../entities/MChannel.entity";
import { globalUtiles } from "../utiles/globalUtilse.service";
import { In, Repository } from "typeorm";
import { roomUsers } from "../entities/RoomUsers.entity";
import { bannedUsers } from "../entities/bannedUsers.entity";


@Injectable()
export class adminService {
	constructor(private globalUtiles: globalUtiles,
		@InjectRepository(roomUsers) private roomUser: Repository<roomUsers>,
		@InjectRepository(bannedUsers) private ban: Repository<bannedUsers>,
		@InjectRepository(Channel) private channel: Repository<Channel>,
		@InjectRepository(MChannel) private message: Repository<MChannel>) { }

	async getlistadmin(userId: number, channelId: number) {
		const founduser = await this.globalUtiles.findOneInRoomUser(userId, channelId);
		if (!founduser)
			throw new ForbiddenException('user is not a member of this channel');

		const data = await this.roomUser.find({
			where: {
				channel: { id: channelId },
				role: In(['admin', 'owner']),
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
		if (data.length < 1)
			throw new NotFoundException('no admin or owner in this channel');

		const data_abouazi_want = [];
		data_abouazi_want.push(data[0].channel);
		for (const item of data) {
			item.users.role = item.role;
			data_abouazi_want.push(item.users)
		}
		return data_abouazi_want
	}

	async kickUser(myId: number, userId: number, channelId: number) {
		const found = await this.globalUtiles.findOneInRoomUser(userId, channelId);
		const myId_ = await this.globalUtiles.findOneInRoomUser(myId, channelId);

		if (!found || !myId_)
			throw new NotFoundException('user not found');

		if (found.role === 'owner' || found.role === 'admin')
			throw new UnauthorizedException('You do not have permission to kick the administator');

		if (myId_.role !== 'owner' && myId_.role !== 'admin')
			throw new UnauthorizedException('You do not have permission to kick other user');

		this.roomUser.delete(found.id);
		return `user ${found.users.username} has been kicked successfully`;
	}

	async muteUser(myId: number, userId: number, channelId: number, muteDuration: number) {
		const myId_ = await this.globalUtiles.findOneInRoomUser(myId, channelId);
		if (!myId_)
			throw new NotFoundException('user or channel not found');

		if (myId_.role !== 'owner' && myId_.role !== 'admin')
			throw new UnauthorizedException('You do not have permission to mute administator');
		const user = await this.globalUtiles.findOneInRoomUser(userId, channelId);
		if (user && user.role === 'owner')
			throw new ForbiddenException('You do not have permission to mute owner');
		if (!user || !myId)
			throw new NotFoundException('user or channel not found');
		if (user.id === myId_.id)
			throw new ForbiddenException('You do not have permission to mute yourself');

		const time = muteDuration * 60;
		user.isMuted = true;
		user.muteStartTimestamp = (Math.floor(parseInt(new Date().getTime().toString()) / 1000) + time).toString();

		await this.roomUser.save(user);
		return `user' ${user.users.username} has been muted successfully for ${muteDuration} minutes`;
	}

	async unmuteUser(myId: number, userId: number, channelId: number) {
		const myId_ = await this.globalUtiles.findOneInRoomUser(myId, channelId);
		if (!myId_)
			throw new NotFoundException('user not found');

		if (myId_.role !== 'owner' && myId_.role !== 'admin')
			throw new UnauthorizedException('user is not administator');

		const user = await this.globalUtiles.findOneInRoomUser(userId, channelId);
		if (!user)
			throw new NotFoundException('user or channel not found');

		if (user.role === 'owner' || user.role === 'admin')
			throw new ForbiddenException('You do not have permission to mute yourself');

		if (!user.isMuted)
			throw new NotFoundException('user not muted');

		if (user.isMuted) {
			await this.roomUser.update(user.id, {
				isMuted: false,
				muteStartTimestamp: '0',
			});
			return true;
		}
		return false
	}

	async banUser(myId: number, userId: number, channelId: number) {
		const myId_ = await this.globalUtiles.findOneInRoomUser(myId, channelId);
		if (!myId_)
			throw new NotFoundException('user not found');


		if (myId_.role !== 'owner' && myId_.role !== 'admin')
			throw new UnauthorizedException('user is not administator');
		const found = await this.globalUtiles.findOneInRoomUser(userId, channelId);
		if (!found)
			throw new NotFoundException('user not found');
		if (found.role === 'owner' || found.role === 'admin')
			throw new ForbiddenException('You do not have permission to ban yourself');

		this.roomUser.delete(found.id);
		await this.ban.save({
			users: { id: userId },
			channel: { id: channelId }
		});
		return `user ${found.users.username} has been banned successfully`;
	}

	async unBanUser(myId: number, userId: number, channelId: number) {
		const myId_ = await this.globalUtiles.findOneInRoomUser(myId, channelId);
		if (!myId_)
			throw new NotFoundException('user not found');
		if (myId_.role !== 'owner' && myId_.role !== 'admin')
			throw new UnauthorizedException('user is not administator');

		const checkIsBaned = await this.ban.findOne({
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
					type: true,
					createdAt: true,
					updatedAt: true,
				},
			}
		})
		if (!checkIsBaned)
			throw new NotFoundException('user not banned');
		this.ban.delete(checkIsBaned.id);
		await this.roomUser.save({
			users: { id: userId },
			channel: { id: channelId },
			role: 'member',
			isMuted: false,
		});
		return `user ${checkIsBaned.users.username} has been unbanned successfully`;
	}

	async addUserAsAdmin(myId: number, userId: number, channelId: number) {
		const checkIsOwner = await this.globalUtiles.findOneInRoomUser(myId, channelId);
		if (!checkIsOwner)
			throw new ForbiddenException('user not found');
		if (checkIsOwner && checkIsOwner.role !== 'owner')
			throw new ForbiddenException('you have not permission to add another user as administator');

		const checkUser = await this.globalUtiles.findOneInRoomUser(userId, channelId);
		if (!checkUser)
			throw new ForbiddenException(`user ${userId} not exist`);
		if (checkUser && checkUser.status !== 'accepted')
			throw new ForbiddenException('user is not accepted in channel');

		if (checkUser.role === 'owner' || checkUser.role === 'admin')
			throw new ForbiddenException('user is administator');

		checkUser.role = 'admin';
		await this.roomUser.save(checkUser);
		const data = await this.globalUtiles.findOneInRoomUser(userId, channelId);
		return `User ${checkIsOwner.users.username} has been added ${data.users.username} as admin successfully.}`;
	}

	async deletePermissionForAdmin(myId: number, userId: number, channelId: number) {
		const checkIsOwner = await this.globalUtiles.findOneInRoomUser(myId, channelId);
		const checkAdmin = await this.globalUtiles.findOneInRoomUser(userId, channelId);

		if (!checkIsOwner || !checkAdmin)
			throw new NotFoundException('user or channel not found');
		if (checkIsOwner.id === checkAdmin.id)
			throw new ForbiddenException('can not delete permission for yourself');
		if (checkIsOwner && checkIsOwner.role !== 'owner' && checkIsOwner.role !== 'admin')
			throw new ForbiddenException('user is not administator');

		if (checkAdmin && checkAdmin.role === 'owner')
			throw new ForbiddenException('user is owner');

		if (checkAdmin && checkAdmin.role !== 'admin')
			throw new ForbiddenException('user is not admin');

		if (checkIsOwner.role === 'owner') {
			checkAdmin.role = 'member';
			this.roomUser.save(checkAdmin);
			return `User ${checkIsOwner.users.username} has been removed ${checkAdmin.users.username} as admin successfully.`;
		}
	}

	async deletechannel(userId: number, channelId: number) {
		const found = await this.globalUtiles.findOneInRoomUser(userId, channelId);
		if (!found)
			throw new NotFoundException('user or channel not found');

		if (found.role === 'owner') {
			await this.roomUser.delete({ channel: { id: channelId } });
			await this.message.delete({ channel: { id: channelId } });
			await this.ban.delete({ channel: { id: channelId } });
			await this.channel.delete({ id: channelId });
			return `channel ${found.channel.title} has been deleted successfully.`;
		}
		else
			throw new ForbiddenException('user is not owner');
	}

	async UpdateTitlechannel(title: string, userId: number, channelId: number) {
		if (title.length < 1)
			throw new BadRequestException('title is too small');
		const administrator = await this.globalUtiles.findOneInRoomUser(userId, channelId);
		if (!administrator)
			throw new NotFoundException(`user ${userId} not found`);

		const foundRoom = await this.globalUtiles.findOneInChannel(channelId);
		if (!foundRoom)
			throw new NotFoundException(`room '${channelId}' not found`);

		const checkTitle = await this.globalUtiles.checkTitle(title);
		if (checkTitle)
			throw new BadRequestException('title is already exist');

		if (administrator.role !== 'owner')
			throw new NotFoundException(`user ${administrator.users.username} is not administrator`);

		foundRoom.title = title;
		const updated = await this.channel.save(foundRoom);
		return ` channel ${updated.title} has been updated successfully by ${administrator.users.username}`;
	}

	async UpdateTypechannel(type: string, password: string, userId: number, channelId: number) {
		const administrator = await this.globalUtiles.findOneInRoomUser(userId, channelId);
		if (!administrator)
			throw new NotFoundException(`user ${userId} not found`);

		const foundRoom = await this.globalUtiles.findOneInChannel(channelId);
		if (!foundRoom)
			throw new NotFoundException(`room '${channelId}' not found`);

		if (administrator.role !== 'owner')
			throw new NotFoundException(`user ${administrator.users.username} is not administrator`);

		const password_ = await this.globalUtiles.checkType(type, password);

		const checkTypeofChannel = await this.globalUtiles.checkType_(type)

		if (!checkTypeofChannel)
			throw new NotFoundException('type of channel not correct');

		foundRoom.type = type;
		foundRoom.password = password_;
		const updated = await this.channel.save(foundRoom);
		return ` channel ${updated.title} has been updated successfully by ${administrator.users.username}`;
	}

	async UpdatePasswordchannel(password: string, userId: number, channelId: number) {
		const administrator = await this.globalUtiles.findOneInRoomUser(userId, channelId);
		if (!administrator)
			throw new NotFoundException(`user ${userId} not found`);

		const foundRoom = await this.globalUtiles.findOneInChannel(channelId);
		if (!foundRoom)
			throw new NotFoundException(`room ${channelId} not found`);
		if (foundRoom.type != 'protected')
			throw new NotFoundException('channel must be a protected')
		foundRoom.password = await this.globalUtiles.hashPassword(password)

		if (administrator.role !== 'owner')
			throw new NotFoundException(`user ${administrator.users.username} is not administrator`);

		const updated = await this.channel.save(foundRoom);
		return ` channel ${updated.title} has been updated successfully by ${administrator.users.username}`;
	}
}
