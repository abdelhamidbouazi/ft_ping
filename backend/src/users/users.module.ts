/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   users.module.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: atabiti <atabiti@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/18 09:27:15 by atabiti           #+#    #+#             */
/*   Updated: 2024/01/12 12:25:06 by atabiti          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Module } from '@nestjs/common';
import { AvatarUploadService } from './upload/avatarupload.service';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Global_blocking } from './entities/Global_blocking.entity';
import { roomUsers } from 'src/channel/entities/RoomUsers.entity';
import { MChannel } from 'src/channel/entities/MChannel.entity';
import { bannedUsers } from 'src/channel/entities/bannedUsers.entity';
import { FriendsService } from 'src/friends/friends.service';
import { FriendRequest } from 'src/friends/friendrequest.entity';
import { GameHistory } from 'src/game/entities/game-history.entity';
import { EmiterGateway } from 'src/chat/emiter/emiter.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([User,roomUsers,bannedUsers,MChannel,Global_blocking,GameHistory,FriendRequest])],
  controllers: [UsersController],
  providers: [UserService,AvatarUploadService,FriendsService,EmiterGateway]
})
export class UsersModule {}