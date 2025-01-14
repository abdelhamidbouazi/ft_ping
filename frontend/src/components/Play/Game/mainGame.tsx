'use client'
import TableGame from '../Draw/drawGame';
import { useEffect ,useContext} from 'react';
import { DataContext } from '../context';
import WaitingPlayer from './WaitingPlayer';
import YouWin from './YouWin';
import YouLose from './YouLose';
import Invite from './invite';
import { Image, Spinner } from "@nextui-org/react";
const Startgame = () => {

    const  { invite, log, player1 , player2 , data ,setData, globalSocket ,setPlayer2 , setPlayer1 , setColor} = useContext(DataContext);

    
    useEffect(()=>{

    
        if(log.current)
        { 
       
            if(!invite)
                globalSocket.emit("choseMode");
            globalSocket.on("playerInfo",(data:any)=>{
                if(data.number === 1){
                    setPlayer1((prevData:any)=>({...prevData,username : data.username}));
                    setColor(data.color);
                    setData((prevData:any)      => ({ ...prevData, roomId : data.id}));
                }
                if(data.number === 2){
                     setColor(data.color);
                }
            });
            globalSocket.on("startedGame",(data:any)=>{
                
                setPlayer1((prevData:any)=>({...prevData,username : data.user1 , image : data.avatar1}));
                setPlayer2((prevData:any)=>({...prevData,username : data.user2,  image : data.avatar2}));
                setData((prevData:any)      => ({ ...prevData, isjoin : true  , start  : true,win : false , roomId : data.id}));
            });
            log.current = false;
        }

    },[data,log,setColor,setData,setPlayer1,setPlayer2,globalSocket])
    
    return (
        
       
    <div className="  w-full  h-full flex flex-col justify-around items-start rounded-2xl">
        {
            (!data.isjoin   &&  !data.start  &&  !data.win && invite === true) ? <>
            <div className='flex items-center justify-center w-96 h-96 mx-auto'>
                <Spinner label="waiting game to start" color="secondary" labelColor="secondary"/>
            </div>
           </> : 
           <>
       <div className="text-white sm:text-1xl md:text-4xl w-[70%] h-1/6 flex justify-around items-center">
            <h5 className="">Ping-Pong Game</h5>
        </div>
        <div className=" w-full h-5/6 ">
            <div className=" h-5/6 flex justify-center items-center ">
                {
                    (data.isjoin    &&   data.start  &&  !data.win)?   <TableGame  globalSocket={globalSocket}/> 
                :   (data.isjoin    &&  !data.start  &&   data.win)?   <YouWin/>
                :   (data.isjoin    &&  !data.start  &&  !data.win)?   <YouLose/>
                :   (!data.isjoin   &&  !data.start  &&  !data.win)?   <WaitingPlayer globalSocket={globalSocket}/>
                :   <h1>error start game</h1>
                }
            </div>
            <div className="h-1/6 flex ">
                    <div className="w-1/3 h-full flex flex-col md:flex-row  md:justify-around justify-center items-center">
                        < Image alt="player1 image" width={400} height={400} src={player1.image} className="w-12 h-12 md:w-24 md:h-24 rounded-full"/>
                        <div className="flex flex-col justify-around items-center">
                            <h1><span className="text-white md:text-3xl" > {player1.username} </span></h1>
                           
                        </div>
                    </div>
                    <div className="flex justify-center items-center w-1/3 md:text-3xl text-white">
                        <h1>  {player1.score} - {player2.score} </h1>
                    </div>
                    <div className="w-1/3 h-full flex flex-col md:flex-row md:justify-around justify-center items-center">
                        <Image alt="player2 image" width={400} height={400} src={player2.image} className="sm:order-1 md:order-2 w-12 h-12 md:w-24 md:h-24 rounded-full"/>
                        <div className="flex flex-col justify-around items-center sm:order-1 sm:text-center">
                            <h1><span className="text-white md:text-3xl" > {player2.username} </span></h1>
                           
                        </div>
                    </div>
            </div>
        </div>
           </>
        }
       
    </div>
);
};

export default Startgame;