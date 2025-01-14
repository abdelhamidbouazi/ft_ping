/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   friends.controller.ts                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: atabiti <atabiti@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/18 09:26:32 by atabiti           #+#    #+#             */
/*   Updated: 2024/01/26 23:13:08 by atabiti          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Controller, Get, Post, Put, Request, Res, Param, Delete, ForbiddenException, NotFoundException, UseGuards, UnauthorizedException, Inject, BadRequestException } from '@nestjs/common';
import { UserService } from 'src/users/users.service';
import { FriendsService } from './friends.service';
import { FriendRequest } from './friendrequest.entity';
import { PongGuaard } from 'src/auth/auth_guard_pong';
import { EmiterGateway } from 'src/chat/emiter/emiter.gateway';
import { User } from 'src/users/entities/user.entity';

@UseGuards(PongGuaard)
@Controller('friends')
export class FriendsController {
  constructor(
    private readonly socketGateway: EmiterGateway,
    private usersService: UserService,
    private friendsService: FriendsService
  ) { }

  @Post('sendarequest/:r_username')
  async send_a_friend_req(@Param('r_username') r_username, @Request() req, @Res() res) {
    try {

      const loggeduser = req.user_data
      const receiveruser = await this.usersService.findbyusername(r_username);
      if (!loggeduser || !receiveruser) {
        throw new NotFoundException('User does not exist!');
      }
      else {
        if (receiveruser.username == loggeduser.username) {
          throw new ForbiddenException('Same User!');
        }
        const blocked_list = await this.usersService.check_if_blockedbymeorbyhim(loggeduser.id, receiveruser.id);
        if (blocked_list) {
          throw new ForbiddenException('BLOCKED User!');
        }
        const tmp: FriendRequest[] = await this.friendsService.FriendRequestRepository.find({ where: { sender: loggeduser.username, receiver: receiveruser.username } });
        if (tmp.length >= 1) {
          throw new ForbiddenException("Too many Friends requests to the same User!");
        }
        const reqqq = new FriendRequest();
        reqqq.sender = loggeduser.username;
        reqqq.receiver = receiveruser.username;
        reqqq.status = "pending";
        await this.friendsService.createFriendRequest(reqqq);
        this.socketGateway.server.to(receiveruser.username).emit('new_friend_request');
        return res.status(200).json({ success: true });

      }
    }
    catch (error) {
      throw new ForbiddenException(error.response)
    }
  }

  @Post('accept_a_request/:s_username')
  async accept_a_request(@Param('s_username') s_username, @Request() req) {

    try {
      const loggeduser = req.user_data
      const senderuser = await this.usersService.findbyusername(s_username);
      if (!loggeduser || !senderuser) {
        throw new ForbiddenException('User does not exist!');
      }
      else {
        const req_to_accpet = await this.friendsService.findpendingFriendRequest(senderuser.username, loggeduser.username);
        if (!req_to_accpet)
          throw new ForbiddenException('No such friend request!');
        const to_be_removed = await this.friendsService.findpendingFriendRequest(loggeduser.username, senderuser.username);
        if (to_be_removed)
          this.friendsService.FriendRequestRepository.delete(to_be_removed)
        req_to_accpet.status = "accepted";
        await this.friendsService.FriendRequestRepository.save(req_to_accpet);
        this.socketGateway.server.to(loggeduser.username).emit('accept_request');
        this.socketGateway.server.to(senderuser.username).emit('accept_request');
        return req_to_accpet;
      }
    }
    catch (error) {
      throw new ForbiddenException(error.response);

    }
  }

  @Put('cancel/:username')
  async cancel_areq(@Param('username') canceledone, @Request() req) {
    try {

      const loggeduser = req.user_data;
      const canceled_one = await this.usersService.findbyusername(canceledone);
      const req_to_cancel = await this.friendsService.findpendingFriendRequest(loggeduser.username, canceled_one.username);
      if (!req_to_cancel)
        throw new NotFoundException("NO such friend request!")
      this.friendsService.FriendRequestRepository.delete(req_to_cancel);
      this.socketGateway.server.to(loggeduser.username).emit('cancel_request', `You canceled ${canceled_one.username} friend request that was sent`);
      this.socketGateway.server.to(canceled_one.username).emit('cancel_request');
      return `done :  request cancelled`

    }
    catch (error) {
      throw new NotFoundException(error.response)
    }
  }

  @Delete('reject/:username')
  async reject_it(@Param('username') reject_username, @Request() req) {
    try {
      const loggeduser = req.user_data
      const rejected_one = await this.usersService.findbyusername(reject_username);
      const req_to_accpet = await this.friendsService.findpendingFriendRequest(rejected_one.username, loggeduser.username);
      if (!req_to_accpet)
        throw new NotFoundException("NO such friend request!")

      this.friendsService.FriendRequestRepository.delete(req_to_accpet)
      this.socketGateway.server.to(loggeduser.username).emit('reject_request', `You rejected  ${rejected_one.username} friend request`);
      this.socketGateway.server.to(rejected_one.username).emit('reject_request');
      return `done : ${reject_username} request rejected`
    }
    catch (error) {
      throw new NotFoundException(error.response)
    }
  }

  @Get('FriendsReqs')
  async get_pending(@Request() req): Promise<User[]> {
    try {

      const loggeduser = req.user_data
      const reqs = await this.friendsService.FriendRequestRepository.find({ where: { receiver: loggeduser.username, status: "pending" } });
      const ret: User[] = []
      for (const req of reqs) {
        ret.push(await this.usersService.findbyusernameforfriendreq(req.sender))
      }
      return ret

    }
    catch
    {
      throw new BadRequestException("FriendsReqs: bad request")
    }
  }


  @Get('pending_i_sent')
  async issent(@Request() req): Promise<FriendRequest[]> {
    try {

      const loggeduser = req.user_data
      const reqs: FriendRequest[] = await this.friendsService.FriendRequestRepository.find({ where: { sender: loggeduser.username, status: "pending" } });
      return reqs

    }
    catch
    {
      throw new BadRequestException("FriendsReqs: bad request")
    }
  }

  @Get('My_Friends')
  async My_Friends(@Request() req): Promise<User[]> {
    try {
      const loggeduser = req.user_data
      const friends_list = await this.friendsService.FriendRequestRepository.find({ where: [{ sender: loggeduser.username, status: "accepted" }, { receiver: loggeduser.username, status: "accepted" }] });
      const arr: User[] = [];
      for (const afriend of friends_list) {
        if (afriend.receiver == loggeduser.username) {
          arr.push(await this.usersService.userRepository.findOne({ where: { username: afriend.sender }, select: ['id', 'displayName', 'Avatar_URL', "nickname", "username", "status", "achievements", "ladder_lvl",] }));
        }
        else {
          const fr = await this.usersService.userRepository.findOne({ where: { username: afriend.receiver }, select: ['id', 'displayName', 'Avatar_URL', "nickname", "username", "status", "achievements", "ladder_lvl",] })
          arr.push(fr);

        }
      }
      return arr
    }
    catch {
      throw new BadRequestException("My_Friends: bad request")

    }
  }

  @Delete('unfriend/:s_username')
  async unfriend(@Request() req, @Param('s_username') s_username) {
    try {
      const loggeduser = req.user_data
      const unfriendme = await this.usersService.findbyusername(s_username);
      if (!unfriendme) {
        throw new NotFoundException('User does not exist!');
      }
      if (loggeduser.username == unfriendme.username) {
        throw new ForbiddenException("You cannot friend/Unfriend yourself");
      }
      const tmp = await this.friendsService.FriendRequestRepository.findOne({ where: [{ sender: loggeduser.username, receiver: s_username, status: "accepted" }, { receiver: loggeduser.username, sender: s_username, status: "accepted" }] });
      if (!tmp) {
        throw new ForbiddenException("IS NOT IN YOUR  FREINDS LIST!");
      }
      await this.friendsService.FriendRequestRepository.delete(tmp);
      this.socketGateway.server.to(loggeduser).emit('unfriend_event');
      this.socketGateway.server.to(unfriendme.username).emit('unfriend_event');
      return true
    }
    catch (error) {
      throw new ForbiddenException(error.response);

    }
  }
}

