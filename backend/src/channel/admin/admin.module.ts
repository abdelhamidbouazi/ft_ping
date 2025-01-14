import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { adminController } from "./admin.controller";
import { roomUsers } from "../entities/RoomUsers.entity";
import { bannedUsers } from "../entities/bannedUsers.entity";
import { Channel } from "../entities/Channel.entity";
import { adminService } from "./admin.service";
import { globalUtiles } from "../utiles/globalUtilse.service";
import { MChannel } from "../entities/MChannel.entity";
import { UserService } from "src/users/users.service";
import { User } from "src/users/entities/user.entity";
import { Global_blocking } from "src/users/entities/Global_blocking.entity";
import { MessageChannelService } from "../messageChannel/messageChannel.service";
import { EmiterGateway } from "src/chat/emiter/emiter.gateway";

@Module({
	imports: [
		TypeOrmModule.forFeature([roomUsers, MChannel, User, Channel, bannedUsers, Global_blocking])
	],
	controllers: [adminController],
	providers: [UserService, adminService, globalUtiles, MessageChannelService, EmiterGateway],
})
export class admineModule { }