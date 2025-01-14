import { Server, Socket } from "socket.io";
import { Room } from "../../entities/room.entity";
import { User } from "src/users/entities/user.entity";


//interfaces
import { playersConnected } from '../interfaces/player.interface'
import { Rooms_           } from '../interfaces/room.interface';
import { invite           } from '../interfaces/invite.interface';

//-----------------------------------------------------------Invite Functions---------------------------------------------------------------//

export  function checkInvit(invitations: any, data: any):Promise<any>
 {
    const invitation = invitations[data.username1];
    if (invitation && invitation.usernames) {
        for (let i = 0; i < invitation.usernames.length; i++) {
            1   
            if (invitation.usernames[i] === data.username2
                ) {
                return invitation.usernames[i];
            }
        }
    }
    return undefined;
}


export async function sendAlert(server: Server, TheInvited: string, data  : any , socket:string) {

    return  server.to(socket).emit("messageInvi", data.username1);
}



export async function Invite(client:Socket, data:any, server:any, invitations:{[key:string]:invite}, socket:string) 
{

   
    const TheInvited = await checkInvit(invitations, data);
    if (TheInvited) {
      await sendAlert(server,TheInvited, data, socket);
    }
    else {
        if (!invitations[data.username1]) {

            const now = new Date();
            const currenttime = now.getMinutes() + 5;
            invitations[data.username1] = {
                usernames: [data.username2], 
                time: currenttime,
                inviteId : 1,
            };
            sendAlert(server, data.username2, data, socket);
        } else {
            invitations[data.username1].usernames.push(data.username2);
            sendAlert(server, data.username2, data , socket);
        }
    }
}


//----------------------------------------------------Accept invite Functions--------------------------------------------------------------------//

async function createRoomOnDataBase(client: Socket): Promise<number> {
    const newRoom = new Room();
    newRoom.status = 'WAITING';
    newRoom.type = 'PRIVATE';
    newRoom.socket = 1;
    await newRoom.save();
    return newRoom.id;
}

function checktime(time1: number, time2: number) {
    if (time2 >= 55 && time2 <= 59) {
        time1 = (time1 + 5) % 60;
        time2 = (time2 + 5) % 60;
    }
    if ((time1 - time2) <= 5 && (time1 - time2) >= 0) {
        ////////////console.log("valid");
        return true;
    } else {
        ////////////console.log("not valid");
        ////////////console.log("------expired invi-------")
        return false;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

export async function AcceptedInvite(client:Socket, data:any, server:Server, rooms:{[key:string]:Rooms_},socket1:Socket,invitations:{[key:string]:invite},player1:playersConnected , player2:playersConnected , sockets:any) : Promise<boolean>{

        //////console.log("accept invite function is called and room is created ... ");
        const id = await createRoomOnDataBase(client);
        let room = { ball: { x: 0, y: 0, dx: 1, dy: 1, r: 6, speed: 1 },state : true,players : [{socketid : socket1.id,y : 0},{socketid : client.id,y : 0}]};
        rooms[id] = room;
        //////console.log("room  is craeted and the room is : ", room);
        socket1.join(id.toString());
        client.join(id.toString());
        server.to(id.toString()).emit("AcceptedInvi");
        await sleep(2000);
        //////console.log("after 5s i'm here ... ");
        server.to(id.toString()).emit("startedGame", { id: id, user1: player1.username, user2: player2.username , avatar1 :player1.avatar , avatar2 : player2.avatar });
        //////console.log("started game is done ... ");
        return true;
}




//-------------------------------------------------------------Refuse invite functions------------------------------------------------------------------//


export async function  RefuseInvite(client: Socket,socket1:string,username2:string, server: Server, invitations: {[key:string]:invite}) {

    //////console.log("invitation is refused ... " );
    server.to(socket1).emit("RefuseInvi", username2);
    //remove one user(username2) from invitaions
    //

}

