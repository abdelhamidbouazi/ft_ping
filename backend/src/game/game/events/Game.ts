import { Server, Socket } from "socket.io";
import { GameHistory } from "src/game/entities/game-history.entity";
import { Room } from "src/game/entities/room.entity";
import { User } from "src/users/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

//interfaces
import { playersConnected } from '../interfaces/player.interface'
import { Bot ,Game} from '../interfaces/infos.interface'
import { Rooms_ } from '../interfaces/room.interface';


export class allfunctions {
    constructor(@InjectRepository(User) private users: Repository<User>,
    ) {
    }

    async Quit(client: Socket, room: Rooms_, id: number, player1: playersConnected, player2: playersConnected | Bot, server: Server) {
        //////console.log("hello quit");
        try {
            if (room) {
                if (client.id === room.players[0].socketid) {
                    player1.score = 0;
                    player2.score = 3;
                }
                else if (client.id === room.players[1].socketid) {
                    player1.score = 3;
                    player2.score = 0;
                }
                server.to(id.toString()).emit('UPDATE', { room: room, score1: player1.score, score2: player2.score });
                this.endMatch(room, server, id, player1, player2);
                this.saveMatch(id, player1, player2,server);
            }
        }
        catch (error) {
            console.log('Error occurred:', error);
        }
    }



    endMatch(room: Rooms_, server: Server, id: number, player1: playersConnected, player2: playersConnected | Bot) {
        try{
            room.state = false;
            server.to(id.toString()).emit("UPDATE", { room: room, score1: player1.score, score2: player2.score });
            if (player1.mode === "Invite") {
    
                server.to(id.toString()).emit('EndInvite', (player1.score > player2.score) ? room.players[1].socketid : room.players[0].socketid);
            }
            else {
    
                server.to(id.toString()).emit('EndGame', (player1.score > player2.score) ? room.players[1].socketid : room.players[0].socketid);
            }
        }
        catch (error) {
            console.log('Error occurred:', error);
        }

    }

    async clearDate(player1 : playersConnected, player2 : playersConnected | Bot , id : number){
        try{

            await Room.delete(id);
            player1.state = "NotOnGame";
            player2.state = "NotOnGame";
            player1.score = 0;
            player2.score = 0;
        }
        catch(error){
           
        }

    }

    async saveMatch(id: number, player1: playersConnected, player2: playersConnected | Bot , server: Server) {

        try {

            const history = new GameHistory();
            history.score_player1 = player1.score;
            history.score_player2 = player2.score;
            history.player1 = player1.username;
            history.player2 = player2.username;
            //console.log()
            
            const player1_ = await this.users.findOne({ where: { username: player1.username } })
            
            const player2_ = await this.users.findOne({ where: { username: player2.username } })
            if (player1.score > player2.score) {
                if (player1_) { 

                    player1_.wins++;
                    player1_.total_matches++;
                    player1_.ladder_lvl = (player1_.ladder_lvl + 0.23);
                    await this.users.save(player1_)
                    if (player1_.ladder_lvl >= 2) {
                        if(!player1_.achievements.includes('AMATUR'))
                        player1_.achievements.push("AMATUR")
                        await this.users.save(player1_)
                        server.to(player1_.username).emit('new_achievement_unlocked');
                    }

                    if (player1_.ladder_lvl >= 4) {
                        if(!player1_.achievements.includes('SEMI-PRO'))
                        player1_.achievements.push("SEMI-PRO")
                        await this.users.save(player1_)
                        server.to(player1_.username).emit('new_achievement_unlocked');
                    }
                    if (player1_.ladder_lvl >= 7) {
                        if(!player1_.achievements.includes('PRO'))
                        player1_.achievements.push("PRO")
                        await this.users.save(player1_)
                        server.to(player1_.username).emit('new_achievement_unlocked');
                    }
                    if (player1_.ladder_lvl >= 10) {
                        if(!player1_.achievements.includes('MASTER'))
                        player1_.achievements.push("MASTER")
                        await this.users.save(player1_)
                        server.to(player1_.username).emit('new_achievement_unlocked');
                    }
                }
                if (player2_) {
                    player2_.total_matches++;
                    player2_.loses++;
                    if(player2_.ladder_lvl >= 1)
                    player2_.ladder_lvl = (player2_.ladder_lvl - 0.15);
                    await this.users.save(player2_)

                }
            }
            else if (player1.score < player2.score) {
                if (player2_) {
                    player2_.total_matches++;
                    player2_.wins++;
                    player2_.ladder_lvl = (player2_.ladder_lvl + 0.23);
                    await this.users.save(player2_)

                    if (player2_.ladder_lvl >= 2) {
                        if(!player2_.achievements.includes('AMATUR'))
                        player2_.achievements.push("AMATUR")
                        await this.users.save(player2_)
                        server.to(player2_.username). emit('new_achievement_unlocked');                
                    }
    
                    if (player2_.ladder_lvl >= 4) {
                        if(!player2_.achievements.includes('SEMI-PRO'))
                        player2_.achievements.push("SEMI-PRO")
                        await this.users.save(player2_)
                        server.to(player2_.username). emit('new_achievement_unlocked');                
                    }
                    if (player2_.ladder_lvl >= 7) {
                        if(!player2_.achievements.includes('PRO'))
                        player2_.achievements.push("PRO")
                        await this.users.save(player2_)
                        server.to(player2_.username). emit('new_achievement_unlocked');                
                    }
                    if (player2_.ladder_lvl >= 10) {
                        if(!player2_.achievements.includes('MASTER'))
                        player2_.achievements.push("MASTER")
                        await this.users.save(player2_)
                        server.to(player2_.username). emit('new_achievement_unlocked');                
                    }
                }
                if (player1_) {
                    player1_.total_matches++;
                    player1_.loses++;
                    if(player1_.ladder_lvl >= 1)
                    player1_.ladder_lvl = (player1_.ladder_lvl - 0.15);
                    await this.users.save(player1_)

                }
            }
            if(player1_)
            {
                player1_.status = "online"
                await this.users.save(player1_)
            }
            if(player2_)
            {
                player2_.status = "online"
                await this.users.save(player2_)
            }
            
            await history.save();
            server.emit('level_updated');                
            this.clearDate(player1,player2,id);

        } 
        catch (error) {
            //////console.log("Error......",error);
        }
    }


    changePositionBall(room: Rooms_) {
        room.ball.x += room.ball.dx * room.ball.speed;
        room.ball.y += room.ball.dy * room.ball.speed;
    }

    resetBAllPosition(room: Rooms_, canvas: Game) {
        room.ball.x = canvas.width / 2;
        room.ball.y = canvas.height / 2;
        room.ball.speed = 0.6;
    }

    checkPlayer2(room: Rooms_, canvas: Game) {

        //info ball
        const ballRight = room.ball.x + room.ball.r;
        const ballBottom = room.ball.y + room.ball.r;
        const ballTop = room.ball.y - room.ball.r;

        //info player
        const y2left = canvas.width - 4;
        const y2Top = room.players[1].y
        const y2Bottom = room.players[1].y + 40;

        //if statement
        if (ballRight > y2left && ballBottom > y2Top && ballTop < y2Bottom) {
            room.ball.dx = -Math.abs(room.ball.dx);
        }
    }
    checkPlayer1(room: Rooms_) {

        //info ball
        const ballLeft = room.ball.x - room.ball.r;
        const ballBottom = room.ball.y + room.ball.r;
        const ballTop = room.ball.y - room.ball.r;

        //info player
        const y1Right = 4;
        const y1Top = room.players[0].y;
        const y1Bottom = room.players[0].y + 40;

        //if statement
        if (ballLeft < y1Right && ballBottom > y1Top && ballTop < y1Bottom) {
            room.ball.dx = Math.abs(room.ball.dx);
        }

    }

    checkWallY(room: Rooms_, canvas:Game) {
        if ((room.ball.y - 3) < 0 || (room.ball.y + 3) > canvas.height)
            room.ball.dy *= -1;
    }

   Game(rooms_,sockets,room: Rooms_, player1: playersConnected, player2: playersConnected, roomid: number, canvas: Game, server: Server): number {
        try {

            room.state = true;
            player1.state = "OnGame";
            player2.state = "OnGame";

            let interval = setInterval(() => {
                if (room && room.state) {
                    this.changePositionBall(room);
                    this.checkWallY(room, canvas);
                    if (room.ball.x < 0) {
                        //update score player1
                        player2.score++;
                        if (player2.score >= 11) {
                            this.endMatch(room, server, roomid, player1, player2);
                            this.saveMatch(roomid, player1, player2,server);
                        }
                        this.resetBAllPosition(room, canvas);
                    }
                    else if (room.ball.x > canvas.width) {
                        player1.score++;
                        if (player1.score >= 11) {
                            this.endMatch(room, server, roomid, player1, player2);
                            this.saveMatch(roomid, player1, player2,server);
                        }
                        this.resetBAllPosition(room, canvas);
                    }
                    if (room.ball.x > (canvas.width / 6) * 5)
                        this.checkPlayer2(room, canvas);
                    else if (room.ball.x < canvas.width / 6)
                        this.checkPlayer1(room);
                    server.to(roomid.toString()).emit("UPDATE", { room: room, score1: player1.score, score2: player2.score });
                }
                else {
                    clearInterval(interval);
                    //console.log('kmlt');
                    //room.state = false;
                    //console.log("game is end ...");
                    if(rooms_[roomid.toString()]){

                        sockets[rooms_[roomid.toString()].players[0].socketid].leave(roomid.toString());
                        sockets[rooms_[roomid.toString()].players[1].socketid].leave(roomid.toString());
                        //console.log('here everything is clean');
                        delete rooms_[roomid.toString()];
                    }
                    
                    //return roomid;
                }
            }, 1000 / 60);
            return roomid;
        }
        catch (error) {
            //////console.log(error)
        }
    }

    botGame(bot,rooms_,sockets,room: Rooms_, player1: playersConnected, player2: Bot, roomid: number, canvas: Game, server: Server): number {
        
        room.state = true;
        player1.state = "OnGame";
        player2.state = "OnGame";

        let interval = setInterval(() => {
            if (room.state) {
                this.changePositionBall(room);
                const paddleFollowFactor = 0.65;
                
                
                if (room.ball.y <= 70) {
                    room.players[1].y = Math.min(room.ball.y * paddleFollowFactor, canvas.height - 40);
                } else if (room.ball.y >= canvas.height - 40) {
                    room.players[1].y = Math.max(room.ball.y * paddleFollowFactor, 0);
                } else {
                    room.players[1].y = room.ball.y * paddleFollowFactor;
                }
                room.players[1].y = Math.max(0, Math.min(room.players[1].y, canvas.height - 40));
                
                this.checkWallY(room, canvas);
                if (room.ball.x < 0) {
                    player2.score++;
                    this.resetBAllPosition(room, canvas);
                    if (player2.score >= 11) {
                        this.endMatch(room, server, roomid, player1, player2);
                        this.saveMatch(roomid, player1, player2,server);
                    }
                }
                else if (room.ball.x > canvas.width) {
                    player1.score++;
                    this.resetBAllPosition(room, canvas);
                    if (player1.score >= 11) {
                        this.endMatch(room, server, roomid, player1, player2);
                        this.saveMatch(roomid, player1, player2,server);
                    }
                }
                else if (room.ball.x > (canvas.width / 6) * 5) {
                    const prev = room.ball.dx;
                    this.checkPlayer2(room, canvas);
                    if (room.ball.dx !== prev && player2.isHard) {
                        room.ball.speed += 0.09;
                    }
                }
                else if (room.ball.x < canvas.width / 6) {
                    const prev = room.ball.dx;
                    this.checkPlayer1(room);
                    if (room.ball.dx !== prev && player2.isHard) {
                        room.ball.speed += 0.09;
                    }
                }
                server.to(roomid.toString()).emit('UPDATE', { room: room, score1: player1.score, score2: player2.score });
            }
            else {
                //console.log('kmlt');
                //room.state = false;
                // //console.log("game is end ...");
                // //console.log("id ----- : ", roomid);
                // if(rooms_[roomid.toString()]){
                    
                //         sockets[rooms_[roomid.toString()].players[0].socketid].leave(roomid.toString());
                //         sockets[rooms_[roomid.toString()].players[1].socketid].leave(roomid.toString());
                //         //console.log('here everything is clean');
                //         delete rooms_[roomid.toString()];
                //         delete bot[roomid.toString()];
                // }
                    clearInterval(interval);
            }
        }, 1000 / 60);
        return roomid;
    }
}





