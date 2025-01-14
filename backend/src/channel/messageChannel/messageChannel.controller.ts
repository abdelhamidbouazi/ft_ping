import { Controller, Get, Param, Req, NotFoundException, BadRequestException, HttpException } from '@nestjs/common';
import { MessageChannelService } from './messageChannel.service';
import { PongGuaard } from "src/auth/auth_guard_pong";
import { UseGuards } from '@nestjs/common';
import { UserService } from 'src/users/users.service';
import { myParseIntPipe } from '../utiles/parse-int.pipe';

@UseGuards(PongGuaard)
@Controller('channel')
export class MessageChannelController {
	constructor(private messageChannel: MessageChannelService, private readonly UserSer: UserService) { }

	@Get('messages/:channelId')
	async fidOnMessage(@Param('channelId', new myParseIntPipe()) channelId: number, @Req() req) {
		try {
			const theuser = await this.UserSer.http_decoder(req.headers.cookie);
			const user = await this.UserSer.findbyusername(theuser);
			if (!user)
				throw new NotFoundException("user not found")

			const resss = await this.messageChannel.globalUtiles.findOneInRoomUser(user.id, channelId)
			if (!resss)
				throw new NotFoundException("user is not member of that channel")
			if (resss && resss.status == "pending")
				throw new NotFoundException("user is not member of that channel")
			return await this.messageChannel.hideMessageFromUserBlocked(user.id, channelId);
		} catch (error) {
			throw new BadRequestException(error.response);
		}
	}
}
