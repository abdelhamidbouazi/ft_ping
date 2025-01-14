/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   app.module.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: atabiti <atabiti@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/18 09:27:27 by atabiti           #+#    #+#             */
/*   Updated: 2023/10/18 09:27:27 by atabiti          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config'; //to load the .env file
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendsModule } from './friends/friends.module';
import { ChatModule } from './chat/chat.module';
import { MessageChannelModule } from './channel/messageChannel/messageChannel.module';
import { admineModule } from './channel/admin/admin.module';
import { ChannelModule } from './channel/channel.module';
import { bannedUsers } from './channel/entities/bannedUsers.entity';
import { Channel } from './channel/entities/Channel.entity';
import { MChannel } from './channel/entities/MChannel.entity';
import { User } from './users/entities/user.entity';
import { roomUsers } from './channel/entities/RoomUsers.entity';
import { Chat } from './chat/entities/chat.entity';
import { FriendRequest } from './friends/friendrequest.entity';
import { Global_blocking } from './users/entities/Global_blocking.entity';
import { GameModule } from './game/game/game.module';

import { Invite_ } from './game/entities/invite.entity';
import { Room } from './game/entities/room.entity';
import { GameHistory } from './game/entities/game-history.entity';


@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot() // load the .env file
    ,
    AuthModule,
    FriendsModule,
    ChatModule,
    MessageChannelModule,
    ChannelModule,
    admineModule, GameModule,
    TypeOrmModule.forRoot(
      {
        type: 'postgres',
        host: 'db',
        // host: 'localhost',
        port: 5432,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        entities: [roomUsers, Chat, FriendRequest, bannedUsers, Channel, MChannel, User, Global_blocking, GameHistory, Invite_, Room],
        synchronize: true,
      })
  ],
})
export class AppModule { }

