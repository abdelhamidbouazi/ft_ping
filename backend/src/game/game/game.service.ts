import { Injectable, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Socket } from "socket.io";
import { GameHistory } from "src/game/entities/game-history.entity";
import { UserService } from 'src/users/users.service';
import { FriendsService } from 'src/friends/friends.service';
import { Room } from '../entities/room.entity';


//interfaces
import { playersConnected } from './interfaces/player.interface'
import { Rooms_           } from './interfaces/room.interface';


@Injectable()
export class GameService {
    constructor(
        @InjectRepository(User)
        public userrepo: Repository<User>,
        @InjectRepository(GameHistory)
        public gamehistory: Repository<GameHistory>,
        public readonly userService: UserService,
        public readonly friendsService: FriendsService
    ) { }



    async ifFriends(username1: string, username2: string) {

        const tmp = await this.friendsService.FriendRequestRepository.findOne({ where: { sender: username1, receiver: username2, status: "accepted" } });
        const tmp1 = await this.friendsService.FriendRequestRepository.findOne({ where: { sender: username2, receiver: username1, status: "accepted" } });
        if(!tmp && !tmp1){
            ////////////console.log("----------not a friends----------");
            return false;
        }
        ////////////console.log("--------------is a friends------------");
        return true;
    }

    async createRoomOnDataBase(socketid: number, state: string, type: string): Promise<number> {
        const newRoom = new Room();
        newRoom.status = state;
        newRoom.type = type;
        newRoom.socket = socketid;
        await newRoom.save();
        return newRoom.id;
    }

  
  
    async Random(client: Socket, rooms: { [key: string]: Rooms_ }, player: playersConnected): Promise<number> {
        try {
            const waitingRoomCount = await Room.count({ where: { status: 'WAITING', type: 'PUBLIC' } });
            const id = player.id;
            let id_: number;

            if (waitingRoomCount === 0) {
                let idroom = await this.createRoomOnDataBase(id, "WAITING", "PUBLIC");
                rooms[idroom] = { players: [{ socketid: client.id, y: 0 }], ball: { x: 0, y: 0, dx: 0, dy: 0, r: 0, speed: 0 }, state: false };
                client.join(idroom.toString());
                //////console.log("room is created ...");
                player.state = "WAITING";
                return -1;
            } else {
                const waitingRooms = await Room.find({ where: { status: 'WAITING', type: 'PUBLIC' } });
                for (const room of waitingRooms) {
                    
                    const isBlocked = await this.userService.check_if_blockedbymeorbyhim(id, room.socket);
                    const userCreatedRoom = await this.userService.userRepository.findOne({where : { id : room.socket}});
                    //////console.log("user created room : " , userCreatedRoom.username);

                    if (isBlocked || player.username ===  userCreatedRoom.username) {
                       
                        // if( player.username ===  userCreatedRoom.username)
                                ////console.log("mymknch t9aser m3a rasek");
                        let idroom = await this.createRoomOnDataBase(id, "WAITING", "PUBLIC");
                        player.state = "WAITING";
                        rooms[idroom] = { players: [{ socketid: client.id, y: 0 }], ball: { x: 0, y: 0, dx: 0, dy: 0, r: 0, speed: 0 }, state: false };
                        client.join(idroom.toString());
                       
                        return -1;
                    }
                    else {
                        
                        id_ = room.id;
                        rooms[id_].players.push({ socketid: client.id, y: 0 });
                        client.join(id_.toString());
                        room.status = "RUNNING";
                        await room.save();
                        return id_;

                    }
                }
            }
        }
        catch (error) {
           
        }
    }


    async Bot(client: Socket, rooms: { [key: string]: Rooms_ }, playerRowid): Promise<number> {
        let idroom = await this.createRoomOnDataBase(playerRowid, "RUNNING", "BOT");
        rooms[idroom] = { players: [{ socketid: client.id, y: 0 }, { socketid: "Bot", y: 0 }], ball: { x: 0, y: 0, dx: 0, dy: 0, r: 0, speed: 0 }, state: false };
        client.join(idroom.toString());
        return idroom;
    }

    async choseMode(client: Socket, player: playersConnected, rooms: { [key: string]: Rooms_ }): Promise<number> {

        ////////////console.log("player is :" + player);
        if (player && player.mode) {
            if (player.mode === "Random") {
                return await this.Random(client, rooms, player);
            }
            else {
                return await this.Bot(client, rooms, player.id)
            }
        }
    }

}