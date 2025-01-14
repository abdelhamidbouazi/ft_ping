/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   user.entity.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: atabiti <atabiti@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/18 09:27:09 by atabiti           #+#    #+#             */
/*   Updated: 2023/10/18 09:27:09 by atabiti          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, } from "typeorm";
import { MChannel } from "src/channel/entities/MChannel.entity";
import { roomUsers } from "src/channel/entities/RoomUsers.entity";
import { OneToMany } from 'typeorm';
import { bannedUsers } from "src/channel/entities/bannedUsers.entity";


@Entity()

export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, unique: true })
  nickname: string;

  @Column({ nullable: true, unique: true })
  username: string;

  @Column({ nullable: true })
  twoFactorAuthSecret: string

  @Column({ default: false })
  isTwoFactorEnable: boolean

  @Column({ default: false })
  is_looged: boolean


  @Column({ nullable: true })
  displayName: string

  @Column({ nullable: true })
  Avatar_URL: string;
  @Column({ default: 'offline' })
  status: string;
  @Column('simple-array', { nullable: true, default: [] })
  achievements: string[];
  @Column('simple-array', { nullable: true })
  sockets_for_status: string[];
  @Column('float', { default: 0.0 })
  ladder_lvl: number



  /*************** [amrakibe] *****************/
  @Column({ nullable: true })
  role: string
  @OneToMany(() => MChannel, (messageChannel) => messageChannel.users)
  messageChannel: MChannel[];
  @OneToMany(() => bannedUsers, (bannedUsers) => bannedUsers.users)
  bannedUsers: bannedUsers[];
  @OneToMany(() => roomUsers, (room_users) => room_users.users)
  roomUsers: roomUsers[];

  /// ilyassss
  @Column({ nullable: true })
  score: number;
  @Column({ nullable: true })
  socket: string;
  @Column({ nullable: true })
  state: string;
  @Column({ nullable: true })
  mode: string;
  @Column({ nullable: true })
  color: string;
  @ManyToMany('User')
  @JoinTable()
  conversations: User[];
  @Column({ nullable: true, default: 0 })
  wins: number
  @Column({ nullable: true, default: 0 })
  loses: number
  @Column({ nullable: true, default: 0 })
  total_matches: number
}
