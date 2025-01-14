import { Controller, Get, UseGuards, Req, Param, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ChatService } from './chat.service';
import { UserService } from 'src/users/users.service';
import { PongGuaard } from 'src/auth/auth_guard_pong';
import { Chat } from './entities/chat.entity';
import { User } from 'src/users/entities/user.entity';

@UseGuards(PongGuaard)
@Controller('chat')
export class chatcontroller {
  constructor(private chat_dm: ChatService, private usersService: UserService) { }
  /************************************ get DM: two users ***********************************************/
  @Get("DM/:username")
  async get_conversation_of_two_users(@Req() req, @Param('username') username: string): Promise<string[]> {
    try {

      const loggeduser = req.user_data
      const target = await this.usersService.findbyusername(username);
      const check_blocking: Boolean = await this.usersService.check_if_blockedbymeorbyhim(loggeduser.id, target.id);

      if (check_blocking) {
        return []
      }
      if (!target || !loggeduser)
        throw new NotFoundException("No Such user!")
      const messages_dm: Chat[] = await this.chat_dm.chatRepository.find({
        where: [{ sender: loggeduser.username, receiver: username }, { sender: username, receiver: loggeduser.username }], order: {
          createdAttime: "ASC"
        }
      });
      console
      const arr = []
      const user1 = await this.usersService.userRepository.findOne({ where: { username: username }, select: ['id', 'displayName', 'Avatar_URL', "username", "status",] });
      arr.push([user1, messages_dm])
      return arr;
    }
    catch (error) {
      throw new NotFoundException(error.response);
    }
  }


  @Get('getdmsorgnized')
  async get_dm__(@Req() req): Promise<User[]> {

    try {
      const loggeduser = req.user_data
      const all = await this.usersService.userRepository.find({
        where: {

          id: loggeduser.id
        },

        relations: ['conversations'],
        select: {

          conversations:
          {
            id: true,
            username: true,
            nickname: true,
            displayName: true,
            Avatar_URL: true,
            status: true,
          }

        },
      });
      /*
      [{"id":7,"nickname":"example","username":"example",.......
      "conversations":[{"id":6,"nickname":"90435_atabiti","username":"atabiti","displayName":"Anas Tabiti","Avatar_URL":"/atabiti.jpg","status":"online"}]}]
      */
      return all[0].conversations

      /*
      [{"id":6,"nickname":"90435_atabiti","username":"atabiti","displayName":"Anas Tabiti","Avatar_URL":"URL/atabiti.jpg","status":"offline"}]
       */
    }
    catch
    {
      throw new BadRequestException("bad request")
    }
  }
}
