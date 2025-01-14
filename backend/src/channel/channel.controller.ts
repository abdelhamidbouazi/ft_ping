import { BadRequestException, Body, Controller, Get, HttpException,  NotFoundException, Param,  ParseFilePipeBuilder, Post,  Req, Res, UnauthorizedException, UploadedFile, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { Channel } from './entities/Channel.entity';
import { UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PongGuaard } from "src/auth/auth_guard_pong";
import { UserService } from "src/users/users.service";
import { myParseIntPipe } from './utiles/parse-int.pipe';
import { channelDto, joinChanDto } from './channelDto/channelDto';
import { EmiterGateway } from 'src/chat/emiter/emiter.gateway';
import { globalUtiles } from './utiles/globalUtilse.service';

@UseGuards(PongGuaard)
@Controller('channel')
export class ChannelController {
	constructor(
		private readonly socketGateway: EmiterGateway,
		public readonly globalU: globalUtiles,
		private readonly channelService: ChannelService, private readonly UserSer: UserService) { }

	@Post('joinprivate_public/:channelId')
	async joinChannel(@Param('channelId', new myParseIntPipe()) channelId: number, @Req() req) {
		try {
			const user = req.user_data
			const findchannel = await this.globalU.findOneInChannel(channelId);
			if (!findchannel) {
				throw new NotFoundException("channel not found");
			}
			if (findchannel.type === "protected") {
				throw new UnauthorizedException("this channel is protected");
			}
			const ret = await this.channelService.joinchannelPrivatePublic(channelId, user.id);
			this.socketGateway.server.to(findchannel.id.toString()).emit('joinprivate_public', ` ${user.username} joined to  chan ID ${channelId}  `);
			return ret
		} catch (error) {
			throw new BadRequestException(error.response);
		}
	}

	@Post('join/protected')
	async joinChannelProtected(@Body(new ValidationPipe()) dto: joinChanDto, @Req() req) {
		try {
			const user = req.user_data
			const ret = await this.channelService.joinChannelProtected(dto.channelId, user.id, dto.Password);
			const findOne = await this.globalU.findOneInChannel(dto.channelId);
			if (findOne.type === "public" || findOne.type === "private") {
				throw new UnauthorizedException("this channel is not public or private");
			}
			if (joinChanDto)
				this.socketGateway.server.to(findOne.id.toString()).emit('join_protected', ` ${user.username} joined to protected chan ID ${dto.channelId}  `);
			return ret
		} catch (error) {
			throw new BadRequestException(error.response);
		}
	}


	@Post('createchannel')
	async createChannel(@Body(new ValidationPipe()) channel: Channel, @Req() req) {
		try {
			const user = req.user_data
			const ret = await this.channelService.createRooms(channel, user.id);
			this.socketGateway.server.emit('createchannel', `chan created: ${channel.title} `);
			return ret
		} catch (error) {
			throw new BadRequestException(error.response);
		}
	}

	@Post('inviteuser/:userId')
	async sendInvit(@Body('') dto: channelDto, @Req() req) {
		try {
			const user = req.user_data
			const findOne = await this.UserSer.findOne(dto.userId);
			this.socketGateway.server.to(findOne.username).emit('inviteuser', `you are invited to : ${dto.channelId} `);
			return await this.channelService.sendInvit(user.id, dto.userId, dto.channelId);
		} catch (error) {
			throw new BadRequestException(error.response);
		}
	}

	@Post('leavechannel')
	async leaveRoom(@Body('channelId', myParseIntPipe) channelId: number, @Req() req) {
		try {
			const user = req.user_data
			return await this.channelService.leaveRoom(channelId, user.id);
		} catch (error) {
			throw new BadRequestException(error.response);
		}
	}

	@Post('acceptInvit/:channelId')
	async acceptInvit(@Param('channelId', new myParseIntPipe()) channelId: number, @Req() req) {
		try {
			const user = req.user_data
			const ret = await this.channelService.acceptInvit(user.id, channelId);
			const findOne = await this.globalU.findOneInChannel(channelId);
			await this.socketGateway.server.to(findOne.id.toString()).emit('acceptInvit', `acceptInvit : ${user.username} joined to  chan ID ${channelId}  `);
			return ret

		} catch (error) {
			throw new BadRequestException(error.response);
		}
	}

	@Get(':id')
	async getRoomsById(@Param('id', new myParseIntPipe()) channelId_: string) {
		try {
			const channeId = parseInt(channelId_);
			if (isNaN(channeId)) {
				throw new BadRequestException("id must be a number");
			}
			return await this.channelService.getRooms_allusers(channeId);

		} catch (error) {
			throw new BadRequestException(error.response);
		}
	}

	@Get('notjoinedchannel/in')
	async getchannel(@Req() req) {
		try {
			const user = req.user_data
			return await this.channelService.getchannel(user.id);
		} catch (error) {
			throw new BadRequestException(error.response, 'error in getchannel');
		}
	}

	@Get('')
	async getAllchannel() {
		try {
			return await this.channelService.getAll();

		} catch (error) {
			throw new BadRequestException(error.response);
		}
	}

	@Get('alluser/:channelId')
	async getAllUserInChannel(@Param('channelId', new myParseIntPipe()) channelId: number, @Req() req) {
		try {
			const user = req.user_data
			return await this.channelService.getAllUserInChannel(channelId, user.id);

		} catch (error) {
			throw new BadRequestException(error.response);
		}
	}

	@Get('baned/:id')
	async getBanedUsers(@Req() req, @Param('id', new myParseIntPipe()) channelId: number) {
		try {
			const user = req.user_data
			return await this.channelService.getBanedUsers(channelId, user.id);

		} catch (error) {
			throw new BadRequestException(error.response);
		}
	}

	@Post('upload/:channelId')
	@UseInterceptors(FileInterceptor('avatar'))
	async avatar_uplaoder(@Param('channelId', new myParseIntPipe()) channelId: number, @UploadedFile(new ParseFilePipeBuilder().addFileTypeValidator({ fileType: 'image/jpeg|png|gif', }).addMaxSizeValidator({ maxSize: 9000000 }).build()) avatar: any, @Req() req) {
		try {
			const user = req.user_data
			const findOne = await this.globalU.findOneInChannel(channelId);
			if (!findOne) {
				throw new NotFoundException("channel not found");
			}
			await this.channelService.save_file_avatar(avatar, channelId, user.id);
			this.socketGateway.server.to(findOne.id.toString()).emit('updateChannel', `chan with id ${channelId} is updated `);
			return;

		} catch (error) {
			throw new BadRequestException(error.response);
		}
	}

	@Get("avatar/:channelId")
	async get_chann_avatar(@Param("channeId", new myParseIntPipe()) channelId: number, @Res() res) {
		try {
			res.send(await this.channelService.get_saved_avatar(channelId));

		} catch (error) {
			throw new BadRequestException(error.response);
		}
	}

	@Get('mychannels/in')
	async getmychannel(@Req() req) {
		try {
			const user = req.user_data
			return await this.channelService.getmychannels(user.id);
		} catch (error) {
			throw new BadRequestException(error.response);
		}
	}


	@Get('ismuted/:channelId')
	async listmuteusers(@Param('channelId', new myParseIntPipe()) channelId: number, @Req() req) {
		try {
			const user = req.user_data
			return await this.channelService.getlistmutedusers(user.id, channelId);
		}
		catch (error) {
			throw new BadRequestException(error.response);
		}

	}
	@Post('rejectedInvit/:channelId')
	async rejectedInvit(@Param('channelId', new myParseIntPipe()) channelId: number, @Req() req) {
		try {
			const user = req.user_data
			return await this.channelService.rejectedInvit(user.id, channelId);
		}
		catch (error) {
			throw new BadRequestException(error.response);
		}
	}

	@Get('invit/getter')
	async listinviteinchannel(@Req() req) {
		try {
			const user = req.user_data
			return await this.channelService.getlistinviteusers(user.id);
		} catch (error) {
			throw new BadRequestException(error.response);
		}

	}
}

