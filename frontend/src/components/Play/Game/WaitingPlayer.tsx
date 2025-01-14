import React , {useContext } from "react";
import { DataContext } from "../context";
import { Image, Spinner } from "@nextui-org/react";
import {Button} from "@nextui-org/react";
// import Image from 'next/image';

function WaitingPlayer(props:any){

    const {data,setData, log,setComponent , globalSocket , invite} = useContext(DataContext);
   
    function LeaveFunction(){
        setComponent("templates");
        globalSocket.emit("Leave",data.roomId);
        log.current = true;
    }
    return (<div className=" w-full h-full flex justify-evenly ">
        <div className="  w-1/4 flex justify-start items-start ">
            <Button className="text-midnight-secondary bg-midnight hover:bg-midnight-secondary hover:text-midnight"  radius="sm" size="sm" onClick={LeaveFunction}>
             Leave
            </Button>
        </div>
        <div className="  w-1/2 flex justify-center flex-col   items-start">
            <Image src="./images/search.svg" width={100} height={100}  alt=""  className="bg-none"/>
            <span className="text-4xl text-white text-clip"> waiting Player to join </span>
        </div>
    </div>);
}

export default WaitingPlayer