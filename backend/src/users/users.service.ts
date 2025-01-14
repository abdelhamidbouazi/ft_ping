/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   users.service.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: atabiti <atabiti@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/18 09:27:17 by atabiti           #+#    #+#             */
/*   Updated: 2024/01/26 22:58:47 by atabiti          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Global_blocking } from './entities/Global_blocking.entity';
import { WsException } from '@nestjs/websockets';


const jwtConstants = {
  secret: `${process.env.MY_JWT_SECRET}`,
};
//The @Injectable() decorator declares that UserService can be injected and instantiated by Nest as a provider.
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) public userRepository: Repository<User>,
    @InjectRepository(Global_blocking) public Blocking_Repository: Repository<Global_blocking>,
    private jwtService: JwtService
  ) { }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }
  
  async update(user: Partial<User>): Promise<User> {
    return this.userRepository.save(user);
  }

  async setup_nickname(user: User, nickname: string) {

    if (user) {
      user.nickname = nickname;

      await this.userRepository.save(user);
    }
  }
  async setup_displayName(user: User, displayName: string) {

    if (user) {
      user.displayName = displayName;
      await this.userRepository.save(user);
    }
  }
  async update_two_fa(a_USER: User, secret: string) {

    if (a_USER && !a_USER.isTwoFactorEnable) {
      a_USER.twoFactorAuthSecret = secret;
      await this.userRepository.save(a_USER);
    }
    else {
      throw new UnauthorizedException("backend-atabiti:2FA is already activated or You sould generate 2fa code firstly");
    }
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
  async findbyusername(username: string): Promise<User> {
    return this.userRepository.findOne({ where: { username } });
  }
  async findbyusernameforfriendreq(username: string): Promise<User> {
    return this.userRepository.findOne({
      where: { username }, select: {
        id: true,
        username: true,
        nickname: true,
        displayName: true,
        Avatar_URL: true,
        status: true,
      }
    });
  }
  async findbyID(Userid_table: number): Promise<User> {
    return this.userRepository.findOne({ where: { id: Userid_table } });
  }
  async createUserFromFortyTwoProfile(profile): Promise<User> {
    try {
      const user = new User();
      user.username = profile.login;
      user.displayName = profile.displayname;
      user.nickname = profile.id + "_" + profile.login;
      user.isTwoFactorEnable = false;
      user.is_looged = true;
      user.achievements = [];
      user.achievements.push('Newbie');
      user.wins = 0;
      user.ladder_lvl = 0;
      user.Avatar_URL = profile.image.link;
      return await this.userRepository.save(user);
    }
    catch (error) {
      throw new BadRequestException("backend-atabiti:The creation of a user is failed!");
    }
  }
  async get_two_fa_secret(username: string): Promise<string> {
    let user = await this.userRepository.findOne({ where: { username } });
    if (user) {
      return user.twoFactorAuthSecret;
    }
  }

  async http_decoder(cookie: string): Promise<string> {
    try {
      if (cookie) {
        const splitted_cookies = cookie.split(";")
        if (!splitted_cookies) {
          throw new UnauthorizedException("NO cookie No LOIN !");
        }
        for (let cookie__ of splitted_cookies) {
          let [type, token]: string[] = cookie__.split('=');
          let nowhitespaces = type.trim()
          if (nowhitespaces == "jwt_token_mine") {
            const decoded_jwt = await this.jwtService.verifyAsync(token,
              {
                secret: jwtConstants.secret
              });

            if (decoded_jwt) {
              return decoded_jwt.payload;
            }
            else {
              throw new UnauthorizedException("NOT LOGGED")
            }
          }
        }
        throw new UnauthorizedException("NOT LOGGED")
      }
      else {
        throw new UnauthorizedException("NOT LOGGED")
      }
    }
    catch
    {
      throw new UnauthorizedException("NOT LOGGED")
    }
  }
  async ws_decoder(cookie: string): Promise<string> {
    try {
      if (cookie) {
        const splitted_cookies = cookie.split(";")
        if (!splitted_cookies) {
          throw new UnauthorizedException("NO cookie No LOIN !");
        }
        for (let cookie__ of splitted_cookies) {
          let [type, token]: string[] = cookie__.split('=');

          let nowhitespaces = type.trim()
          if (nowhitespaces == "jwt_token_mine") {
            const decoded_jwt = await this.jwtService.verifyAsync(token,
              {
                secret: jwtConstants.secret
              });

            if (decoded_jwt) {
              return decoded_jwt.payload;
            }
            else {

              throw new WsException("NOT LOGGED")
            }
          }
        }
        throw new WsException("NOT LOGGED")
      }
      else {
        throw new WsException("NOT LOGGED")
      }
    }
    catch
    {
      throw new WsException("NOT LOGGED")
    }
  }
  
  async blocker(logged_user: number, tobeblcoked: number) {
    const BLOCKed = new Global_blocking();
    BLOCKed.Blocked_by_id = logged_user;
    BLOCKed.Blocked_one_id = tobeblcoked;
    await this.Blocking_Repository.save(BLOCKed);
  }

  async find_if_blocked(userid: number, unblock_himid: number): Promise<Global_blocking> {
    return await this.Blocking_Repository.findOne({ where: { Blocked_by_id: userid, Blocked_one_id: unblock_himid } })
  }

  async get_all_my_blocked_users(me: number): Promise<Global_blocking[]> {
    return await this.Blocking_Repository.find({ where: { Blocked_by_id: me } });
  }

  async check_if_blockedbymeorbyhim(me: number, him: number): Promise<boolean> {
    const blcoked_by_me = await this.Blocking_Repository.find({ where: { Blocked_by_id: me, Blocked_one_id: him } });
    const blcoked_by_him = await this.Blocking_Repository.find({ where: { Blocked_by_id: him, Blocked_one_id: me } });
    if (blcoked_by_him.length > 0 || blcoked_by_me.length > 0) {
      return true
    }
    else
      return false
  }


  /*********************** created by amrakibe **********************/
  async getAllBlock(userId: number) {
    return await this.Blocking_Repository.find({
      where:
        [
          { Blocked_by_id: userId },
          { Blocked_one_id: userId }
        ]
    });
  }


  // *********** created by amrakibe ***********
  async findReseverIfBlockedBySender(senderId: number, reseverId: number) {
    try {
      return await this.Blocking_Repository.findOne({
        where: [
          { Blocked_by_id: senderId },
          { Blocked_one_id: reseverId },
          { Blocked_by_id: reseverId },
          { Blocked_one_id: senderId }
        ],
      })
    } catch (error) {
      throw error
    }
  }
}