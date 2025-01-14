/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   friends.service.ts                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: atabiti <atabiti@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/18 09:26:39 by atabiti           #+#    #+#             */
/*   Updated: 2024/01/25 16:01:50 by atabiti          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

//nest generate service friend

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendRequest } from './friendrequest.entity';
@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(FriendRequest) public FriendRequestRepository: Repository<FriendRequest>,
  ) { }
  async createFriendRequest(reqestt: FriendRequest): Promise<FriendRequest> {
    return await this.FriendRequestRepository.save(reqestt);
  }
  async findpendingFriendRequest(sender: string, receiver: string): Promise<FriendRequest | undefined> {
    return this.FriendRequestRepository.findOne({
      where: { sender, receiver, status: "pending" },
    });
  }

  async remove_friend_req(me: string, username1: string) {
    const tmp = await this.FriendRequestRepository.findOne({ where: { sender: username1, receiver: me } });
    const tmp1 = await this.FriendRequestRepository.findOne({ where: { sender: me, receiver: username1 } });
    if (tmp) {
     await this.FriendRequestRepository.delete(tmp);
    }
     if (tmp1) {
      await this.FriendRequestRepository.delete(tmp1);
    }
    return
  }
}
