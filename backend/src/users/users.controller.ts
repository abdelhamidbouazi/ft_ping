/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   users.controller.ts                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: atabiti <atabiti@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/18 09:27:12 by atabiti           #+#    #+#             */
/*   Updated: 2024/01/28 02:53:10 by atabiti          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { AvatarUploadService } from './upload/avatarupload.service';
import { BadRequestException, Controller, Get, Post, Body, ParseFilePipeBuilder, Request, Res, Param, Delete, ValidationPipe, NotFoundException, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { UserService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { UploadedFile } from '@nestjs/common'
import { PongGuaard } from '../auth/auth_guard_pong';
import { Global_blocking } from './entities/Global_blocking.entity'
import { FriendsService } from 'src/friends/friends.service';
import { displayName_dto, nickname_dto } from './dtos/nicknameDto';
import { User } from './entities/user.entity';
import { EmiterGateway } from 'src/chat/emiter/emiter.gateway';
import { In, Not } from 'typeorm';
import { get } from 'http';






@Controller('users')
export class UsersController {
  constructor(
		private readonly socketGateway: EmiterGateway,
    private readonly avatarUploadService: AvatarUploadService,
    private readonly friendservice: FriendsService,
    private readonly usersService: UserService,
    private readonly jwtService: JwtService) { }

  @UseGuards(PongGuaard)
  @Post('nickname_update')
  async change_nickname(@Request() req, @Res() res, @Body(new ValidationPipe()) datarecieved: nickname_dto) {
    try {
      const userToUpdate = req.user_data
      await this.usersService.setup_nickname(userToUpdate, datarecieved.nickname);
      this.socketGateway.server.to(userToUpdate.username).emit('update_is_done');
      return res.status(200).json({ success: true });
    }
    catch (error) {
      throw new BadRequestException("nickname is already used!")
    }
  }
  @UseGuards(PongGuaard)
  @Post('displayname_update')
  async change_displayName(@Request() req, @Res() res, @Body(new ValidationPipe()) datarecieved: displayName_dto) {
    try {
      const userToUpdate: User = req.user_data
      await this.usersService.setup_displayName(userToUpdate, datarecieved.displayname);
      this.socketGateway.server.to(userToUpdate.username).emit('update_is_done');
      return res.status(200).json({ success: true });
    }
    catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  @Get('me')
  async find_me(@Req() req): Promise<any> {

    try {
      const theuser = await this.usersService.http_decoder(req.headers.cookie);
      const user = await this.usersService.findbyusername(theuser);
      if (!user) {
        throw new NotFoundException('User does not exist!');
      }
      else {
        const my_profile = {
          displayName: user.displayName,
          username: user.username,
          nickname: user.nickname,
          isTwoFactorEnable: user.isTwoFactorEnable,
          achievements: user.achievements,
          ladder_lvl: user.ladder_lvl,
          is_looged: user.is_looged,
          id: user.id,
          Avatar_URL: user.Avatar_URL,
          wins:user.wins,
          loses:user.loses,
          total_matches:user.total_matches
        };
        return my_profile;
      }
    }
    catch (error) {
      throw new UnauthorizedException(error.message)
    }
  }

  @UseGuards(PongGuaard)
  @Get(':username')
  async get_public_infos(@Param('username') username: string): Promise<any> {
    try {


      const user = await this.usersService.findbyusername(username);
      if (!user) {
        throw new NotFoundException('User does not exist!');
      }
      else {
        const public_profile = {
          id: user.id,
          username: user.username,
          nickname: user.nickname,
          achievements: user.achievements,
          ladder_lvl: user.ladder_lvl,
          status: user.status,
          Avatar_URL: user.Avatar_URL
          , displayName: user.displayName,
          wins:user.wins,
          loses:user.loses,
          total_matches:user.total_matches
          
        };
        return public_profile;
      }
    }
    catch (error) {
      throw new BadRequestException(error.message)

    }
  }

  @UseGuards(PongGuaard)
  @Delete('block/:username')
  async block_a_user(@Param('username') username: string, @Req() req, @Res() res) {
    try {
      const user = req.user_data
      const block_him = await this.usersService.findbyusername(username);
      if (!user || !block_him) {
        throw new NotFoundException('User does not exist!');
      }
      if (user.username == block_him.username) {
        throw new UnauthorizedException('Same user :cannot block Yourself');
      }
      else {
        const check_if_already_blocked = await this.usersService.find_if_blocked(user.id, block_him.id);
        if (check_if_already_blocked) {
          throw new UnauthorizedException('User is already blocked!');
        }

        this.usersService.blocker(user.id, block_him.id);
        this.usersService.update(user);
        this.socketGateway.server.to(user.username).emit('blocking_update', user.id);
        this.socketGateway.server.to(block_him.username).emit('blocking_update', user.id);
        this.friendservice.remove_friend_req(user.username, username);
        return res.status(200).json({ success: true });
      }
    }
    catch (error) {
      throw new BadRequestException(error.message)

    }
  }

  @UseGuards(PongGuaard)
  @Delete('unblock/:username')
  async unblock_a_user(@Param('username') username: string, @Req() req, @Res() res) {

    try {
      const user = req.user_data
      const unblock_him = await this.usersService.findbyusername(username);
      if (!user || !unblock_him) {
        throw new NotFoundException('User does not exist!');
      }
      else if (unblock_him.username == user.username) {
        throw new UnauthorizedException('You cannot unblock/block yourself');
      }

      else {
        const check_if_already_blocked: Global_blocking = await this.usersService.find_if_blocked(user.id, unblock_him.id);
        if (!check_if_already_blocked) {
          throw new UnauthorizedException('User is not blocked (- -)');
        }
        else {
          this.usersService.Blocking_Repository.delete(check_if_already_blocked);
          this.socketGateway.server.to(user.username).emit('blocking_update');
          this.socketGateway.server.to(unblock_him.username).emit('blocking_update');
          return res.status(200).json({ success: true });
        }
      }
    }
    catch (error) {
      throw new BadRequestException(error.message)

    }
  }


  @UseGuards(PongGuaard)
  @Get("blocked/Users")
  async get_all_my_blocked_u(@Req() req): Promise<Global_blocking[]> {
    try {
      const user = req.user_data
      return this.usersService.get_all_my_blocked_users(user.id);
    }

    catch (error) {
      throw new BadRequestException("FALIED")

    }
  }

  @UseGuards(PongGuaard)
  @Get()
  async get_all(): Promise<User[]> {
    try {
      return await this.usersService.userRepository.find({ select: ['id', 'displayName', 'Avatar_URL', "nickname", "username", "is_looged", "status", "achievements", "ladder_lvl",] });
    }
    catch (error) {
      throw new BadRequestException("FALIED")
      
    }
  }
  
  // @UseGuards(PongGuaard)
  // @Get("api/all_users_not_blocked")
  // async aaa(@Req() req) {// Promise<User[]>
  //   try {
  //     const user = req.user_data
  //     // const all_users = await this.usersService.userRepository.find({ select: ['id', 'displayName', 'Avatar_URL', "nickname", "username", "is_looged", "status", "achievements", "ladder_lvl",] });
  //     const blcoked = await this.usersService.getAllBlock(user.id) 
  //     // const userChannelIds = userChannels.map((roomUser) => roomUser.channel.id);
  //     const use = blcoked.map()
  //     const getuser = await this.usersService.userRepository.find({
  //       where:{
  //           id: Not(In(blcoked))
  //       }
  //     })
  //     if(!getuser)
  //       return []
  //     return getuser
  //   }
  //   catch (error) {
  //     //console.log(error)
  //     throw new BadRequestException("FALIED")

  //   }
  // }
  

  @UseGuards(PongGuaard)
  @Post('file_upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploader(@Res() res, @UploadedFile(new ParseFilePipeBuilder().addFileTypeValidator({ fileType: 'image/jpeg|png', }).addMaxSizeValidator({ maxSize: 9000000 }).build()) file: any, @Request() req) {
    try {
      const user_ = req.user_data
      const avatarURL = await this.avatarUploadService.uploadavatar(file);
      user_.isSettingSetted = true;
      user_.Avatar_URL = avatarURL;
      await this.usersService.userRepository.save(user_)
      this.socketGateway.server.to(user_.username).emit('update_is_done');
      res.status(200).json({ success: true, Avatar_URL: avatarURL });
    }
    catch
    {
      throw new NotFoundException('Upload failed');
    }
  }

}
