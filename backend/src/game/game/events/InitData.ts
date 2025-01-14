import {  Server} from "socket.io";

//interfaces
import { Rooms_ } from '../interfaces/room.interface';
import { Game } from '../interfaces/infos.interface'


export function InitData(data : any ,rooms  :{[key:string] : Rooms_} , server : Server , canvas : Game)
{
    canvas.width  = data.canvasWidth  ;
    canvas.height = data.canvasHeight ;
    rooms[data.id].ball = data.ball   ;
    rooms[data.id].ball.x = canvas.width  / 2;
    rooms[data.id].ball.y = canvas.height / 2;
    rooms[data.id].players[0].y = canvas.height/2 - 20;
    rooms[data.id].players[1].y = canvas.height/2 - 20;
    rooms[data.id].ball.speed = 0.6;
    //////console.log("init is called ... ");
    server.to(data.id.toString()).emit("UPDATE",{room : rooms[data.id],score1 : 0 , score2 : 0});

}