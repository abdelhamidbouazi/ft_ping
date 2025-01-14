import { Socket } from "socket.io";

export async function Move(client: Socket, data: any, rooms : any , server : any, canvas :any,Number:number,score1:number,score2 : number){
    ////////////console.log("move here");
    ////console.log("mocve is called ... ");
    if(rooms[data.id].state){
          if (data.direction === 'up')
          {
            rooms[data.id].players[Number].y -= 10;
            if (rooms[data.id].players[Number].y < 0){
              rooms[data.id].players[Number].y = 0;
            }
          }
          else if (data.direction === 'down') 
          {
            rooms[data.id].players[Number].y += 10;
            if (rooms[data.id].players[Number].y > canvas.height - 40) {
              rooms[data.id].players[Number].y= canvas.height - 40;
            }
          }
        server.to(data.id.toString()).emit('UPDATE',{room:rooms[data.id], score1:score1, score2:score2});
    }
}

