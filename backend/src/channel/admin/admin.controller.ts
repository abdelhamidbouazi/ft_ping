
import { BadRequestException, Body, Controller, Delete, Get, HttpException, Param, Post, Put, Req, UnauthorizedException, ValidationPipe } from "@nestjs/common";
import { adminService } from "./admin.service";
import { PongGuaard } from "src/auth/auth_guard_pong";
import { UseGuards } from '@nestjs/common';
import { UserService } from "src/users/users.service";
import { myParseIntPipe } from "../utiles/parse-int.pipe";
import { UpdatePasswrdDto, UpdateTypeDto, adminDto, deleteChannelDto, durationDto, updateTitleDto } from "./adminDto/adminDto";
import { EmiterGateway } from "src/chat/emiter/emiter.gateway";
import { globalUtiles } from "../utiles/globalUtilse.service";

@UseGuards(PongGuaard)
@Controller('administartion')
export class adminController {
	constructor(
		private readonly socketGateway: EmiterGateway,
		public readonly globalU: globalUtiles,
		private readonly adminService: adminService, private readonly UserSer: UserService) { }

	@Get('admin/:channelId')
	async listadmininchannel(@Param('channelId', new myParseIntPipe()) channelId: number, @Req() req) {
		try {
			const user = req.user_data
			return await this.adminService.getlistadmin(user.id, channelId);
		} catch (error) {
			throw new BadRequestException(error.response);
		}
	}

	@Post('kick')
	async kickUser(@Body(new ValidationPipe()) adminDto: adminDto, @Req() req) {
		try {
			const user = req.user_data
			const findchannel = await this.globalU.findOneInChannel(adminDto.channelId);
			if (!findchannel)
				throw new BadRequestException('channel not found');
			const ret = await this.adminService.kickUser(user.id, adminDto.userId, adminDto.channelId)
			await this.socketGateway.server.to(findchannel.id.toString()).emit('kicked', `kick : User with id ${adminDto.userId} kicked from  chan ID ${adminDto.channelId}`);
			return ret
		} catch (error) {
			throw new BadRequestException(error.response);
		}
	}

	@Post('mute')
	async muteUser(@Body(new ValidationPipe()) dto: durationDto, @Req() req) {
		try {
			const user = req.user_data
			const tomute = await this.UserSer.findbyID(dto.userId);
			if (!tomute)
				throw new BadRequestException('user not found');
			const ret = await this.adminService.muteUser(user.id, dto.userId, dto.channelId, dto.duration);
			this.socketGateway.server.to(tomute.username).emit('mute_event', `mute : User with id ${dto.userId} muteed from  chan ID ${dto.channelId}`);
			return ret
		} catch (error) {
			throw new BadRequestException(error.response);
		}
	}

	@Post('unmute')
	async unmuteUser(@Body(new ValidationPipe()) adminDto: adminDto, @Req() req) {
		try {
			const user = req.user_data
			const tomute = await this.UserSer.findbyID(adminDto.userId);
			if (!tomute)
				throw new BadRequestException('user not found');
			const ret = await this.adminService.unmuteUser(user.id, adminDto.userId, adminDto.channelId);
			await this.socketGateway.server.to(tomute.username).emit('unmute_event', `unmute : User with id ${adminDto.userId} unmute from  chan ID ${adminDto.channelId}  `);
			return ret
		} catch (error) {
			throw new BadRequestException(error.response);
		}
	}

	@Post('ban')
	async banUser(@Body(new ValidationPipe()) adminDto: adminDto, @Req() req) {
		try {
			const user = req.user_data
			const findchannel = await this.globalU.findOneInChannel(adminDto.channelId);
			if (!findchannel)
				throw new BadRequestException('channel not found');
			const ret = await this.adminService.banUser(user.id, adminDto.userId, adminDto.channelId);
			await this.socketGateway.server.to(findchannel.id.toString()).emit('ban_event', `ban : User with id ${adminDto.userId} banned from  chan ID ${adminDto.channelId}  `);
			return ret

		} catch (error) {
			throw new BadRequestException(error.response);
		}
	}

	@Post('unban')
	async unBanUser(@Body(new ValidationPipe()) adminDto: adminDto, @Req() req) {
		try {
			const user = req.user_data
			const findchannel = await this.globalU.findOneInChannel(adminDto.channelId);
			if (!findchannel)
				throw new BadRequestException('channel not found');
			const ret = await this.adminService.unBanUser(user.id, adminDto.userId, adminDto.channelId);
			await this.socketGateway.server.to(findchannel.id.toString()).emit('unban_event', `unban_event : User with id ${adminDto.userId} unbanned from  chan ID ${adminDto.channelId}  `);
			return ret
		} catch (error) {
			throw new BadRequestException(error.response);
		}
	}

	@Post('admin')
	async addUserAsAdmin(@Body(new ValidationPipe()) adminDto: adminDto, @Req() req) {
		try {
			const user = req.user_data
			const findchannel = await this.globalU.findOneInChannel(adminDto.channelId);
			if (!findchannel)
				throw new BadRequestException('channel not found');
			const ret = await this.adminService.addUserAsAdmin(user.id, adminDto.userId, adminDto.channelId);
			await this.socketGateway.server.to(findchannel.id.toString()).emit('admin_event', `admin : User with id ${adminDto.userId} is admin now in  chan ID ${adminDto.channelId}`);
			return ret

		} catch (error) {
			throw new BadRequestException(error.response);
		}
	}

	@Delete('unadmin')
	async deletAdminForUser(@Body(new ValidationPipe()) adminDto: adminDto, @Req() req) {
		try {
			const user = req.user_data
			const findOne = await this.globalU.findOneInChannel(adminDto.channelId);
			if (!findOne)
				throw new BadRequestException('channel not found');
			await this.adminService.deletePermissionForAdmin(user.id, adminDto.userId, adminDto.channelId);

			await this.socketGateway.server.to(findOne.id.toString()).emit('unadmin_event', `unadmin : User with id ${adminDto.userId} is no longer admin  in  chan ID ${adminDto.channelId}`);

		} catch (error) {
			throw new BadRequestException(error.response);
		}
	}

	@Delete('deletechannel')
	async deletechannel(@Body(new ValidationPipe()) dto: deleteChannelDto, @Req() req) {
		try {
			const user = req.user_data
			const findchannel = await this.globalU.findOneInChannel(dto.channelId);

			if (!findchannel)
				throw new UnauthorizedException('channel not found');
			const ret = await this.adminService.deletechannel(user.id, dto.channelId);
			this.socketGateway.server.to(findchannel.id.toString()).emit('deletechannel_event', `delete channel : chan with ID ${dto.channelId} is deleted  `);
			return ret

		} catch (error) {
			throw new BadRequestException(error.response);
		}
	}

	@Put('updatetitle')
	async UpdateTitle(@Body(new ValidationPipe()) updateTitleDto: updateTitleDto, @Req() req) {
		try {
			const user = req.user_data
			const findchannel = await this.globalU.findOneInChannel(updateTitleDto.channelId);
			if (!findchannel)
				throw new UnauthorizedException('channel not found');
			await this.adminService.UpdateTitlechannel(updateTitleDto.title.trim(), user.id, updateTitleDto.channelId);
			this.socketGateway.server.emit('updateChannel', `chan ID ${findchannel.title} is updated `);
			return
		} catch (error) {
			throw new BadRequestException(error.response);
		}
	}

	@Put('updatepassword')
	async UpdatePassword(@Body(new ValidationPipe()) dto: UpdatePasswrdDto, @Req() req) {
		try {
			const user = req.user_data
			const findOne = await this.globalU.findOneInChannel(dto.channelId);
			if (!findOne)
				throw new BadRequestException('channel not found');
			await this.adminService.UpdatePasswordchannel(dto.password, user.id, dto.channelId);
			this.socketGateway.server.emit('updateChannel', `chan ID ${dto.channelId} is updated `);
			return

		} catch (error) {
			throw new BadRequestException(error.response);
		}
	}

	@Put('updatetype')
	async UpdateType(@Body(new ValidationPipe()) dto: UpdateTypeDto, @Req() req) {
		try {
			const user = req.user_data
			const findOne = await this.globalU.findOneInChannel(dto.channelId);
			if (!findOne)
				throw new BadRequestException('channel not found');
			await this.adminService.UpdateTypechannel(dto.type, dto.password, user.id, dto.channelId);
			this.socketGateway.server.emit('updateChannel', `chan ID ${dto.channelId} is updated `);
			return
		} catch (error) {
			throw new BadRequestException(error.response);
		}
	}
}
