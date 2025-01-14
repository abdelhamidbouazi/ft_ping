/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   chat.service.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: atabiti <atabiti@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/18 09:26:21 by atabiti           #+#    #+#             */
/*   Updated: 2024/01/10 10:42:00 by atabiti          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { chat_dto } from './dto/chat_dto';
import { User } from 'src/users/entities/user.entity';
@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) public chatRepository: Repository<Chat>,
    @InjectRepository(User) public Userrepo: Repository<User>,
  ) { }
  async createMessage(chat: chat_dto): Promise<Chat> {
    const ch = new Chat()
    ch.sender = chat.sender;
    ch.receiver = chat.receiver;
    ch.text = chat.text;
    const senderUser = await this.Userrepo.findOne({ where: { username: chat.sender }, relations: ['conversations'] });
    const receiverUser = await this.Userrepo.findOne({ where: { username: chat.receiver }, relations: ['conversations'] });

    senderUser.conversations.push(receiverUser);
    await this.Userrepo.save(senderUser);
    receiverUser.conversations.push(senderUser);
    await this.Userrepo.save(receiverUser);
    return await this.chatRepository.save(ch);
  }
}
