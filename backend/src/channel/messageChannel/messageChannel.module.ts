import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MChannel } from "../entities/MChannel.entity";
import { User } from "src/users/entities/user.entity";
import { Channel } from "../entities/Channel.entity";
import { roomUsers } from "../entities/RoomUsers.entity";
import { bannedUsers } from "../entities/bannedUsers.entity";
import { MessageChannelController } from "./messageChannel.controller";
import { MessageChannelService } from "./messageChannel.service";
import { globalUtiles } from "../utiles/globalUtilse.service";
import { MessagesGateway } from "./messages.gateway";
import { UserService } from "src/users/users.service";
import { Global_blocking } from "src/users/entities/Global_blocking.entity";


@Module({
	imports: [
		TypeOrmModule.forFeature([MChannel, User, Channel, roomUsers, bannedUsers,Global_blocking]),
	],
	controllers: [MessageChannelController],
	providers: [MessageChannelService, globalUtiles, MessagesGateway, UserService],
})
export class MessageChannelModule { }