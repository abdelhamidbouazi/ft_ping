import { Socket } from "socket.io";
import { Rooms_ } from "../interfaces/room.interface";
import { Room } from "src/game/entities/room.entity";

export async function Leave(client: Socket, id: number , rooms:{[key:string]:Rooms_}){
    //////console.log("hello leave the room id is : " , id );
    ////////////console.log("socket id : " + client.id);
    delete rooms[id];
    if(!rooms[id])
        //////console.log('room deleted ...');
    await Room.delete(id);
}