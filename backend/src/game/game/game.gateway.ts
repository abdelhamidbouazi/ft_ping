import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InitData } from './events/InitData';
import { Invite, AcceptedInvite, RefuseInvite } from './events/Invite';
import { Leave } from './events/Leave';
import { Move } from './events/Move';
import { UserService } from 'src/users/users.service';
import { GameService } from './game.service';
import { allfunctions } from './events/Game';

//interfaces
import { playersConnected } from './interfaces/player.interface'
import { Game , Bot       } from './interfaces/infos.interface'
import { Rooms_           } from './interfaces/room.interface';
import { invite           } from './interfaces/invite.interface';
import { Room } from '../entities/room.entity';



//global vars
let rooms_: { [key: string]: Rooms_ } = {};
let sockets: { [key: string]: Socket } = {};
let players: { [key: string]: playersConnected } = {};
let bot: { [key: string]: Bot } = {};
let invitations: { [key: string]: invite } = {};
let canvas: Game = { width: 0, height: 0 };


@WebSocketGateway({
    cors: {
        origin: process.env.IP_FRONT,
                methods: ['GET', 'POST'],
        credentials: true,
    },
})


export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(public readonly userService: UserService, public readonly gameService: GameService, private functionsService: allfunctions,) {
    }
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('History')
    handleHistory(client: Socket, data: any) {
        this.History_(client, data);
    }
    async handleConnection(client: Socket) {
        try {
            sockets[client.id] = client;
        }
        catch (error) {
            client.emit('error_message', error);
        }
    }
    @SubscribeMessage('choseMode')
    async HandlechoseMode(client: Socket, data: any) {
        try {
            await this.mode(client);
        } catch (error) { console.log(error); }
    }
    async handleDisconnect(client: Socket) {
        try {
                const room  = await Room.findOne({where : { socket : players[client.id].id , status : "WAITING"}});
                if(room){
                    await Room.delete(room.id);
                }
                delete players[client.id];

        }
        catch (error) {
            client.emit('error_message', error);
        }
    }
    async botGame(idR: number) {

    }
    @SubscribeMessage('InitData')
    async handleData(client: Socket, data: any) {
        try {
            InitData(data, rooms_, this.server, canvas);
            const user= await this.userService.userRepository.findOne({where:{socket:client.id}});
            if (players[client.id].mode === "Bot" || players[client.id].mode === "Difficult Bot") {
                
                if(user)
                {
                    user.status = "gaming"
                    this.userService.userRepository.save(user)
                }
                const id =  this.functionsService.botGame(bot,rooms_,sockets,rooms_[data.id], players[rooms_[data.id].players[0].socketid], bot[data.id], data.id, canvas, this.server);
            }
            else {


                
                const user2= await this.userService.userRepository.findOne({where:{socket:rooms_[data.id].players[1].socketid}});
                if(user2)
                    {
                        user2.status = "gaming"
                        this.userService.userRepository.save(user2)
                    }
                    if(user)
                    {
                        user.status = "gaming"
                        this.userService.userRepository.save(user)
                    }
                const id =  this.functionsService.Game(rooms_,sockets,rooms_[data.id], players[rooms_[data.id].players[0].socketid], players[rooms_[data.id].players[1].socketid], data.id, canvas, this.server);
                if (!rooms_[id.toString()].state) {
                    sockets[rooms_[id.toString()].players[0].socketid].leave(id.toString());
                    sockets[rooms_[id.toString()].players[1].socketid].leave(id.toString());
                    delete rooms_[id.toString()];
                    if(user2)
                    {

                        user2.status = "online"
                        this.userService.userRepository.save(user2)
                    }
                    if(user)
                    {
                        user.status = "online"
                        this.userService.userRepository.save(user)
                    }
                }
            }
        }
        catch (error) {
            client.emit('error_message', error);
        }
    }
    @SubscribeMessage('Login')
    async handleLogin(client: Socket) {
        try {
            const theuser = await this.userService.ws_decoder(client.request.headers.cookie);
            const user = await this.userService.findbyusername(theuser);
            if(user.socket !== client.id){
                user.socket = client.id;
                this.userService.userRepository.save(user);
                players[client.id] = { id: user.id, username: user.username, mode: "bot", state: "NotOnGame", color: "black", avatar: user.Avatar_URL, isHard: false, score: 0 };
            }
        }
        catch (error) {
            client.emit('error_message', error);
        }
    }
    @SubscribeMessage('Move')
    handleMove(client: Socket, data: any) {
        try {
            if (players[rooms_[data.id].players[0].socketid].mode === "Random" || players[rooms_[data.id].players[0].socketid].mode === "Invite") { Move(client, data, rooms_, this.server, canvas, (rooms_[data.id].players[0].socketid === client.id ? 0 : 1), players[rooms_[data.id].players[0].socketid].score, players[rooms_[data.id].players[1].socketid].score); }
            else { Move(client, data, rooms_, this.server, canvas, (rooms_[data.id].players[0].socketid === client.id ? 0 : 1), players[rooms_[data.id].players[0].socketid].score, bot[data.id].score); }
        }
        catch (error) {
            client.emit('error_message', error);
        }
    }

    @SubscribeMessage('Leave')
    async handleLeave(client: Socket, data: number) {
        try {
            const room  = await Room.findOne({where : { socket : players[client.id].id , status : "WAITING"}});
            await Leave(client, room.id ,rooms_);
        }
        catch (error) {
            client.emit('error_message', error);
        }
    }
    @SubscribeMessage('Mode')
    handleMode(client: Socket, data: string) {
        try {
        players[client.id].mode = data;
    }
    catch (error) {
        client.emit('error_message', error);
    }
    }
    @SubscribeMessage('Color')
    handleColor(client: Socket, data: string) {
        try {
            players[client.id].color = data;
        }
        catch (error) {
            client.emit('error_message', error);
        }
    }
        @SubscribeMessage('Invite')
        async handleInvite(client: Socket, data: any) {
            try {
                const cookie = await this.userService.ws_decoder(client.request.headers.cookie)
                const user1 = await this.userService.findbyusername(cookie);
                const user2 = await  this.userService.userRepository.findOne({ where : {username : data.username2 }});
                data.username1 = user1.username;
                const check = await this.userService.check_if_blockedbymeorbyhim(user1.id,user2.id)
                // //console.log(check , " check")
                if(check == false)
                {
                    if(players[user2.socket].state !== "OnGame"){
                        if (data.username1 !== data.username2 && user1 && user2) {
                            await Invite(client, data, this.server, invitations, user2.socket);
                        }
                    }else{
                        client.emit("youOnGame",data.username2);
                    }
                    
                }
                client.emit("blcoked",data.username2);
            }
            catch (error) {
                client.emit('error_message', error);
            }
        }
        @SubscribeMessage('AcceptedInvi')
        async handleAcceptedInvi(client: Socket, username1: any) {
            try {
                const player1 = await this.userService.userRepository.findOne({ where: { username: username1 } });
                
                await this.Accept(client, username1,players[player1.socket],players[client.id],player1.socket);
            }
            catch (error) {
                client.emit('error_message', error);
            }
        }
        @SubscribeMessage('RefuseInvi')
        async handleRefuseInvi(client: Socket, data: any) {
            try {
                const user1 = await this.userService.userRepository.findOne({ where: { username : data } })
                const user2 = await this.userService.userRepository.findOne({ where: { socket : client.id } })
                if(user2 && user1){
                    await RefuseInvite(client,user1.socket,user2.username ,this.server, invitations);
                }
            }
            catch (error) {
                ////////////console.log(error)
                client.emit('error_message', error);
            }
        }
        @SubscribeMessage('Quit')
        async handleQuit(client: Socket, data: any) {
            try {

                //////console.log("quit is called .... ");

                let player2: playersConnected | Bot;
                const player1 = players[rooms_[data.id].players[0].socketid];
                if (player1.mode === "Random" || player1.mode === "Invite") {
                    player2 = players[rooms_[data.id].players[1].socketid];
                } else {
                    player2 = bot[data.id];
                }
                await this.functionsService.Quit(client, rooms_[data.id], data.id, player1, player2, this.server);
                //cahnge state of players
                player2.state = "NotOnGame";
                player1.state = "NotOnGame";
                //remove 
                //console.log("game is end ...");
                sockets[rooms_[data.id.toString()].players[0].socketid].leave(data.id.toString());
                sockets[rooms_[data.id.toString()].players[1].socketid].leave(data.id.toString());
                delete rooms_[data.id.toString()];
                //console.log('here everything is clean');
                if (bot[data.id.toString()])
                    delete bot[data.id.toString()];
                //print state;
                ////////////console.log("state here :" + player1.state);
            }
            catch (error) {
                ////////////console.log(error)
                client.emit('error_message', error);
            }
        }
        @SubscribeMessage('updateLEVEL')
        async update_level(client: Socket, data: any) {
            try {

                ////////////console.log("updateLEVEL is called")
                ////////////console.log(data, "DATA ")
                const user = await this.userService.userRepository.findOne({ where: { socket: client.id } });
                this.userService.userRepository.save(user);
            }
            catch (error) {
            
                client.emit('error_message', error);
            }
        }

        //-----------------------------------------------Invite------------------------------------------------------------//

    checkStatePlayers(user1:playersConnected, user2: playersConnected): number {
        try{


            ////console.log(`username1 : ${user1.username} state1 : ${user1.state}`);
            ////console.log(`username2 : ${user2.username} state2 : ${user2.state}`);
            if (user1 && user2) {
                if (user1.state === "NotOnGame" && user2.state === "NotOnGame") {
                    ////console.log("state  is 0");
                    return 0;
                }
                else if (user1.state === "OnGame") {
                    ////console.log("player 1 is onGame : state  is 1", user1.username);
                    return 1;
                }
                else if (user2.state === "OnGame") {
                    ////console.log("player 2 is onGamne state  is 2", user2.username);
                    return 2;
                }
            }

        }
        catch (error) {
            //////console.log(error)
        }

    }

    async mode(client: Socket) {
        try
        {
            ////console.log(`on mode : username  : ${players[client.id].username} state1 : ${players[client.id].state}`);
        if(players[client.id].state !== "OnGame")
        {            
            const state: number = await this.gameService.choseMode(client, players[client.id], rooms_);
            if (state == -1) {
                client.emit("playerInfo", { username: players[client.id].username, image: players[client.id].avatar, color: players[client.id].color, number: 1 })
                players[client.id].state = ""
            }
            else if (players[client.id].mode === "Random" || players[client.id].mode === "Invite") {
                client.emit("playerInfo", { number: 2, color: players[client.id].color });
                this.server.to(state.toString()).emit("startedGame",
                    {
                        //send players info  to frontend (random mode)
                        id: state,
                        user1   : players[rooms_[state].players[0].socketid].username,
                        avatar1 : players[rooms_[state].players[0].socketid].avatar,
                        user2   : players[rooms_[state].players[1].socketid].username,
                        avatar2 : players[rooms_[state].players[1].socketid].avatar,

                    });
                players[rooms_[state].players[0].socketid].state = "OnGame";
                players[rooms_[state].players[1].socketid].state = "OnGame";

            }
            else {
                client.emit("playerInfo", { number: 1, color: players[client.id].color });
                let minibot: Bot = { username: "bot", score: 0, avatar: "https://e7.pngegg.com/pngimages/498/917/png-clipart-computer-icons-desktop-chatbot-icon-blue-angle-thumbnail.png", isHard: false, state: "OnGame" }
                bot[state] = minibot;
                this.server.to(state.toString()).emit("startedGame",
                    {
                        //send playes info to frontend (Bot mode)
                        id: state,
                        user1: players[rooms_[state].players[0].socketid].username,
                        avatar1: players[rooms_[state].players[0].socketid].avatar,
                        user2: bot[state].username,
                        avatar2: "https://e7.pngegg.com/pngimages/498/917/png-clipart-computer-icons-desktop-chatbot-icon-blue-angle-thumbnail.png",
                    });
                if (players[rooms_[state].players[0].socketid].mode === "Difficult Bot")
                    bot[state].isHard = true;
                // players[rooms_[state].players[0].socketid].state = "OnGame";
                players[client.id].state = "OnGame";
                players[rooms_[state].players[0].socketid].score = 0;
                bot[state].score = 0;
            }
            }
        }
        catch(error){
            //////console.log(error)
        }
        }

    async Accept(client: Socket, data: any,player1:playersConnected, player2:playersConnected,socket1:string) {


        try{

            //set mode of player
            player1.mode = "Invite";
            player2.mode = "Invite";

            const state : number =  this.checkStatePlayers(player1,player2);
            if (state === 0) {
                if (await AcceptedInvite(client, data, this.server, rooms_, sockets[socket1], invitations,player1,player2,sockets)) {
                    
                    //change mode for players
                    player1.state = "OnGame";
                    player2.state = "OnGame";
                }
               
            }
        }catch(error){
            //////console.log(error)
        }

    }

    //-----------------------------------------------------------------------------------------------------------------------------------//



















    async History_(client: Socket, data: any) {
            try {
                const users = await this.userService.userRepository.find({ where: { socket: client.id } });
                for (const user of users) {
                    const history = this.gameService.gamehistory.find({
                        where: [{ player1: user.username }, { player2: user.username }],
                    });
                    ////////////console.log(`History for user ${user.username}:`, history);
                    // client.emit("History_",history);
                }
            } catch (error) {
                console.log('Error occurred while fetching history:', error);
            }
        }

    }













//9ad dak lbot lmza3ter             X(90%)
//chof history wax khedamin         X
//player fach ghadi ydkhol lgame o howa deja f blasa akhra jeri 3lih khalih bezez yquite  
//player makhasoch yl3ab m3a raso   V

//leave                             V

//close tab                         X  
//reload                            X
