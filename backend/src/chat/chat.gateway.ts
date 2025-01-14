/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   chat.gateway.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: atabiti <atabiti@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/18 09:26:18 by atabiti           #+#    #+#             */
/*   Updated: 2024/01/28 02:20:08 by atabiti          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { ValidationPipe } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, ConnectedSocket, WsException } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';
import { UserService } from 'src/users/users.service';
import { chat_dto } from './dto/chat_dto';
import { UseFilters } from '@nestjs/common';
import { ExceptionFilter_ws } from 'src/users/filters/exceptionfilters';
@WebSocketGateway({
  cors: {
    origin: process.env.IP_FRONT, 
    methods: ['GET', 'POST'],
    credentials: true,
  }
})

export class ChatGateway {
  @WebSocketServer() server: Server; // i add to solve this issue : when i emit a message with client.to() the sender does not get that event
  constructor(private readonly chatService: ChatService, private readonly userService: UserService) { }
  async handleConnection(client: Socket) {
    try {


      const str: string = client.handshake.headers.cookie;
      const theuser = await this.userService.ws_decoder(str);
      const user = await this.userService.findbyusername(theuser);
      if (!user) {
        client.disconnect();
        throw new WsException('No such user !!!');
      }
      if (user.is_looged == false) {
        user.status = 'offline';
        user.sockets_for_status = []
        await this.userService.userRepository.save(user);
        client.disconnect();
        throw new WsException('NoT logged !!!');
      }


      user.status = 'online';
      if (!user.sockets_for_status)
        user.sockets_for_status = []
      user.sockets_for_status.push(client.id)
      await this.userService.userRepository.save(user);
      await client.join(user.username)
      return
    }
    catch (error) {
      client.emit('error_message', error);
    }

  }
  async handleDisconnect(client: Socket) {
    try {
      const theuser = await this.userService.ws_decoder(client.handshake.headers.cookie);
      const toupdate = await this.userService.findbyusername(theuser);
    
      if (toupdate) {
        const index = toupdate.sockets_for_status.indexOf(client.id);
        if (index !== -1) {
          toupdate.sockets_for_status.splice(index, 1);
        }
        if (toupdate.sockets_for_status.length < 1)
          toupdate.status = 'offline';
        await this.userService.userRepository.save(toupdate);
        await client.leave(toupdate.username)
        return
      }
      return
    }
    catch (error) {
      client.emit('error_message', error);
    }
  }

  @UseFilters(new ExceptionFilter_ws())
  @SubscribeMessage('sent_dm')
  async dm_him(@ConnectedSocket() client: Socket, @MessageBody(new ValidationPipe()) data: chat_dto): Promise<void> {
    try {
      const username = await this.userService.ws_decoder(client.request.headers.cookie);
      const sender = await this.userService.findbyusername(username);
      const receiver = await this.userService.findbyusername(data.receiver);
      if (!receiver || !sender) {
        throw new WsException('No such receiver!');
      }
      if (receiver.is_looged == false) {
        client.disconnect();
        throw new WsException('NoT logged !!!');
      }
      if (sender.is_looged == false) {
        client.disconnect();
        throw new WsException('NoT logged !!!');
      }
      const check_blocking: Boolean = await this.userService.check_if_blockedbymeorbyhim(sender.id, receiver.id);
      if (check_blocking) {
        throw new WsException('You Blocked this User!');
      }
      if (sender.username == data.receiver) {
        throw new WsException('YOU CANNOT SEND DM TO YOURSELF!');
      }
      if (sender) {
        await this.chatService.createMessage(data);
        this.server.to(receiver.username).emit('received_message', data);
        this.server.to(sender.username).emit('received_message', data);
      }
    }
    catch (error) {
      client.emit('error_message', error.error);
    }
  }
}

