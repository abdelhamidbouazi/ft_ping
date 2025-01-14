import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './entities/Channel.entity';

import { roomUsers } from './entities/RoomUsers.entity';
import { bannedUsers } from './entities/bannedUsers.entity';
import { globalUtiles } from './utiles/globalUtilse.service';
import { MChannel } from './entities/MChannel.entity';
/**atabiti */
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { AvatarUploadService } from 'src/users/upload/avatarupload.service';
import { MessageChannelService } from './messageChannel/messageChannel.service';
import { EmiterGateway } from 'src/chat/emiter/emiter.gateway';
import { UserService } from 'src/users/users.service';
import { Global_blocking } from 'src/users/entities/Global_blocking.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([Channel, User, roomUsers, bannedUsers, globalUtiles, MChannel,Global_blocking]),
	],
	controllers: [ChannelController],
	providers: [ChannelService,AvatarUploadService, globalUtiles,MessageChannelService,EmiterGateway,UserService],
})

export class ChannelModule {}
