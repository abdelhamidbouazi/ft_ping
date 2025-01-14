"use client";

import  React , { useContext  , useRef , useEffect} from "react";
import drawRect from '../Draw/drawRect';
import drawCircle from '../Draw/drawCircle';
import { CSSProperties } from 'react';
import { DataContext } from "../context";

function Template (props:any){


  
    const BStyle:CSSProperties = {
      backgroundColor: props.color,
      color : 'white',
      textAlign: 'center',
      cursor : 'pointer',
      paddingTop : "5%",
    }

    const {setComponent, socket , globalSocket} = useContext(DataContext);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
      const draw = () => {
        const context = canvasRef.current?.getContext('2d');
        if(context && canvasRef.current){
            drawRect(context, 0, 0,canvasRef.current.width,canvasRef.current.height,props.color);
            for(let i = 0; i < canvasRef.current.height ; i+=15){
              drawRect(context, canvasRef.current.width /2 , i, 5, 10,"white");
            }
            drawCircle(context, canvasRef.current.width /2 + 4 , canvasRef.current.height/2 + 4, 8, "white");
            drawRect(context,0,canvasRef.current.height / 2 - 15 ,5,30 ,"white");
            drawRect(context,canvasRef.current.width - 5,canvasRef.current.height / 2 - 15,5,30 ,"white");
        }
      };
      draw();
    }, [props.color]);
   

    function setColorGame(){
      setComponent("startgame");
      globalSocket.emit("Color",props.color);
    
    }
    
    return (
        <div  className="m-5 h-48 w-48 md:h-56   lg:m-2 md:w-56  lg:w-64 xl:h-1/4 xl:w-1/4 xl:m-6 2xl:h-96 2xl:w-96 2xl:m-5 rounded-2xl" onClick={setColorGame} >
            <canvas className="h-4/6 w-full bg-white rounded-2xl" ref={canvasRef}> </canvas>
            <h5 className="my-5 h-1/6 w-full hover:scale-105 text-white rounded-xl" style={BStyle} >{props.text}</h5>
        </div>
      );
}

export default Template