/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   auth.module.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: atabiti <atabiti@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/18 09:24:20 by atabiti           #+#    #+#             */
/*   Updated: 2024/01/27 17:56:46 by atabiti          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Global_blocking } from 'src/users/entities/Global_blocking.entity';

@Module({
  imports: [

    TypeOrmModule.forFeature([User,Global_blocking]),
    JwtModule.register(
      {
      global: true,
      secret: `${process.env.MY_JWT_SECRET}`,
      signOptions: { expiresIn: '10h' }, 
    }),
  ],
  controllers: [AuthController],
  providers: [UserService],
})
export class AuthModule { }