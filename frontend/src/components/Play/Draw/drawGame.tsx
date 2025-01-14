"use client"

import React, { useEffect, useRef , useContext} from 'react';
import { DataContext } from '../context';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import { Image } from "@nextui-org/react";
import drawCenter from "./drawCenter"


interface Ball {
    
  x: number;
  y: number;
  dx: number;
  dy: number;
  r: number;
  speed: number;
}

enum NavigationType {
  navigate = 0,
  reload = 1,
  back_forward = 2,
  close = 2,
}

function PongGame(props: any) {
  const canvasRef = useRef(null);
  const { globalSocket ,setPlayer1, setPlayer2 , data , setData , color , setComponent } = useContext(DataContext);
  const PADDLE_HEIGHT = 40;
  const PADDLE_WIDTH = 6;
  // globalSocket.emit("Login");

  const ballRef = useRef<Ball>({ x: 0, y: 0, dx: 1, dy: 1, r: 3, speed : 1 });
  const y1Ref = useRef<number>(0);
  const y2Ref = useRef<number>(0);


  //draw the game
  
  useEffect(() => {

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const HEIGHT = canvas.height;
    const WIDTH = canvas.width;

    const initializeGame = () => {
      
      globalSocket.emit("InitData", { id: data.roomId, ball: ballRef.current, canvasWidth: WIDTH, canvasHeight: HEIGHT });
    };
    initializeGame();

    globalSocket.on("UPDATE", (data: any) => {
     
      ballRef.current = data.room.ball;
      y1Ref.current = data.room.players[0].y;
      y2Ref.current = data.room.players[1].y;
      setPlayer1((prevData: any) => ({ ...prevData, score: data.score1 }));
      setPlayer2((prevData: any) => ({ ...prevData, score: data.score2 }));
      draw(ctx);
    });

    const handleKeyDown = (e) => {
      
      if (e.key === 'ArrowUp') {
       
        globalSocket.emit("Move", { id: data.roomId, globalSocket: globalSocket.id, direction: "up" });
      } else if (e.key === 'ArrowDown') {
        globalSocket.emit("Move", { id: data.roomId, globalSocket: globalSocket.id, direction: "down" });
      }
      e.preventDefault();

      

    };


    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      globalSocket.off('UPDATE');
    };

  }, [globalSocket, data.roomId]);

  globalSocket.on("EndGame",(id:string) =>{
  
    
    
   if(globalSocket.id == id){
        setData((prevData:any)=>({...prevData, start : false, win : false}));
   }else{
        setData((prevData:any)=>({...prevData, start : false, win : true}));
   }
   return () => { globalSocket.off('EndGame');};
  });

globalSocket.on("EndInvite",(id:string) =>{
  setComponent("modes");
  return () => {
    globalSocket.off('EndInvite');
};
}
);


function handleQuit(){
  Swal.fire({
    title: "Do you want to quit?",
    icon: "error",
    iconHtml: "X",
    confirmButtonText: "Yes",
    cancelButtonText: "No",
    showCancelButton: true,
    showCloseButton: true,
    customClass: {
      container: 'sweetalert-container',
      popup: 'sweetalert-popup',
    },
  }).then((result) => {
    if (result.isConfirmed) {
      globalSocket.emit("Quit", { id: data.roomId });
    }
  });
  
}

const draw = (ctx) => {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvasRef.current?.width, canvasRef.current?.height);
  drawCenter(ctx,{x: canvasRef.current?.width / 2, y:0, color: "white", width : 2 , canvasHeight : canvasRef.current?.height});
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(ballRef.current.x, ballRef.current.y, ballRef.current.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(0, y1Ref.current,4,40);
  ctx.fillRect(canvasRef.current?.width - 4, y2Ref.current,4, 40);

};

 

  return (
    <div className='sm:h-2/6  md:h-3/6 lg:h-4/6 w-full h-5/6  xl:w-5/6 2xl:w-4/6 2xl:h-full flex justify-center items-start '>
      <canvas ref={canvasRef} className='h-5/6  w-5/6 rounded-2xl border-4px border-red-800' />
      <div className='flex justify-center items-start'>
        
        <Image src="/images/cross.png" width={50} height={50} alt="Quit Button" onClick={handleQuit}  className='h-5 w-5' />
      </div>
    </div>
  );
}

export default PongGame;

