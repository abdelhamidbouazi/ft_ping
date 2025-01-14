import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { MessageChannelService } from './messageChannel.service';
import { UseFilters, UseGuards, ValidationPipe } from '@nestjs/common';
import { PongGuaard } from 'src/auth/auth_guard_pong';
import { UserService } from 'src/users/users.service';
import { globalUtiles } from '../utiles/globalUtilse.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { MChannel } from '../entities/MChannel.entity';
import { MessageDto } from './messageChannelDto/messageChannelDto';
import { myParseIntPipe_WS } from '../utiles/parse-int.pipe';
import { ExceptionFilter_ws } from 'src/users/filters/exceptionfilters';

@WebSocketGateway({
  cors: {
    origin: process.env.IP_FRONT,
    methods: ['GET', 'POST'],
    credentials: true,
  }
})



// @UseGuards(PongGuaard)
export class MessagesGateway {
  constructor(private readonly messageChannel: MessageChannelService,
    private readonly userService: UserService,
    public readonly globalUtiles: globalUtiles,
    private readonly usersService: UserService,
    @InjectRepository(MChannel) public m: Repository<MChannel>,
    @InjectRepository(User) public userRepository: Repository<User>
  ) { }

  usersMap = new Map<number, any>();

  async handleConnection(client: Socket) {
    try {

      const username = await this.userService.ws_decoder(client.request.headers.cookie);
      const user = await this.userService.findbyusername(username);
      if (!user)
        throw new WsException('user not found');
      this.usersMap.set(user.id, client);
    } catch (error) {
      client.emit('error_message', error);
    }
  }

  async handleDisconnect(client: Socket) {
    try {
      const username = await this.userService.ws_decoder(client.request.headers.cookie);
      const user = await this.userService.findbyusername(username);
      if (!user) {
        throw new WsException('user not found');
      }
      client.leave(user.username);
      this.usersMap.delete(user.id);
    } catch (error) {
      client.emit('error_message', error);
    }
  }


  @SubscribeMessage('join')
  async join(@ConnectedSocket() client: Socket, @MessageBody('channelId', new myParseIntPipe_WS()) channelId) {

    try {
      const str: string = client.handshake.headers.cookie;
      const username = await this.userService.ws_decoder(str);
      const user = await this.userService.findbyusername(username);
      if (!user)
        throw new WsException('user not found');
      const userChannel = await this.globalUtiles.findOneInRoomUser(user.id, channelId);
      if (!userChannel)
        throw new WsException('user not a member of this channel');

      const channel = await this.globalUtiles.findOneInChannel(channelId)
      client.join(channel.id.toString());
    } catch (error) {
      client.emit('error_message', error);
    }
  }

  @UseFilters(new ExceptionFilter_ws())
  @SubscribeMessage('message')
  async create(@ConnectedSocket() client: Socket, @MessageBody(new ValidationPipe()) tmp: MessageDto) {
    try {
      const channelId = parseInt(tmp.channelId, 10);
      if (isNaN(channelId)) {
        client.emit('error_message', "channelId is not a number");
        throw new WsException('channelId is not a number');
      }

      const str: string = client.handshake.headers.cookie;

      const username = await this.userService.ws_decoder(str);
      if (!username)
        throw new WsException('user not found');

      const user = await this.userService.findbyusername(username);
      if (!user)
        throw new WsException('user not found');

      const findOne = await this.globalUtiles.findOneInChannel(channelId);
      if(!findOne)
        throw new WsException('channel not found');

      const userChannel = this.globalUtiles.findOneInRoomUser(user.id, channelId);
      if (!userChannel)
        throw new WsException('user not a member of this channel');

      const create = await this.messageChannel.createMessage(user.id, channelId, tmp.message);
      if (!create)
        throw new WsException('message not created');


      const UserBlock = await this.usersService.getAllBlock(user.id);

      const idsBlocked = UserBlock.map((users) => users.Blocked_by_id !== user.id ? users.Blocked_by_id : users.Blocked_one_id);

      const socketIds = idsBlocked.map((id) => this.usersMap.get(id)?.id);

      client.except(socketIds).to(findOne.id.toString()).emit('onMessage', tmp.message);
    } catch (error) {
      client.emit('error_message', error.response);
    }
  }
}
