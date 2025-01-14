/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   chat.module.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: atabiti <atabiti@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/18 09:26:19 by atabiti           #+#    #+#             */
/*   Updated: 2024/01/12 13:35:09 by atabiti          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { UserService } from 'src/users/users.service';
import { Chat } from './entities/chat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { chatcontroller } from './chat.controller';
import { User } from 'src/users/entities/user.entity';
import { Global_blocking } from 'src/users/entities/Global_blocking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat,User, Global_blocking])],
  providers: [ChatGateway, ChatService,UserService],
  controllers: [chatcontroller],
})
export class ChatModule {}
