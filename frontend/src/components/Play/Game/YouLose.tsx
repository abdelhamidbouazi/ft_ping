import React , {useContext}from "react";
import { DataContext } from "../context";
import { Button, Image } from "@nextui-org/react";


function YouLose(){

    const {log , setComponent , setPlayer1 , setData , setPlayer2} = useContext(DataContext);

    function InitData(){
        setData((prevData:any)      => ({ ...prevData, isjoin :false ,start : false , win: false , roomId : -1})); 
        setPlayer1((prevData:any)=>({...prevData,username : "Waiting..." , image : "default" , score : 0}));
        setPlayer2((prevData:any)=>({...prevData,username : "Waiting...",  image : "default" , score : 0}));
        log.current = true;
    }
    function handleRestart(){
        InitData();
        setComponent("startgame"); 
       
    }

    function handleExit(){
        InitData();
        setComponent("modes"); 
    }


    return (
        <div className=" w-[60%] h-[80%] rounded-2xl flex justify-center flex-col   items-center">
                <Image className="media_gif__MBeQG"  src="https://i.giphy.com/lWPpTGShahMiGD58Sx.webp" alt="" />
           <div className="flex flex-row gap-4 pt-40">
                <Button  className="border border-midnight-border text-midnight-secondary bg-midnight hover:bg-midnight-secondary hover:text-midnight" onClick={handleRestart}> restart</Button>
                <Button className="border border-midnight-border text-midnight-secondary bg-midnight hover:bg-midnight-secondary hover:text-midnight" onClick={handleExit}> exit</Button>
            </div>
        </div>
    );
}

export default YouLose
