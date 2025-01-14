/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   friends.module.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: atabiti <atabiti@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/18 09:26:35 by atabiti           #+#    #+#             */
/*   Updated: 2024/01/12 14:58:20 by atabiti          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Module } from '@nestjs/common';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequest } from './friendrequest.entity';
import { Global_blocking } from 'src/users/entities/Global_blocking.entity';
import { EmiterGateway } from 'src/chat/emiter/emiter.gateway';
@Module({
  imports: [TypeOrmModule.forFeature([User,FriendRequest,Global_blocking])],
  controllers: [FriendsController],
  providers: [FriendsService,JwtService,UserService,EmiterGateway]
})
export class FriendsModule {}
