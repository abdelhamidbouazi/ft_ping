// app.module.ts

import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { GameService } from './game.service';
import { UserService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { GameHistory } from '../entities/game-history.entity';
import { Global_blocking } from 'src/users/entities/Global_blocking.entity';
import { GameController } from './game.controller';
import { allfunctions } from './events/Game';
import { FriendsModule } from 'src/friends/friends.module';
import { FriendsService } from 'src/friends/friends.service';
import { FriendRequest } from 'src/friends/friendrequest.entity';

@Module({
  
  imports: [UsersModule,FriendsModule,TypeOrmModule.forFeature([User,GameHistory,Global_blocking,FriendRequest])],

  providers: [GameGateway,GameService,UserService,FriendsService,allfunctions],
  controllers: [GameController],

})
export class GameModule {}
