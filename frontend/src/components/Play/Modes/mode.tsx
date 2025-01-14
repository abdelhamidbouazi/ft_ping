import Link from "next/link";
import React, {useContext,useEffect} from "react";
import { DataContext } from "../context";
import { useParams } from "next/navigation";
import { Button, Card, CardFooter, CardHeader, Image } from "@nextui-org/react";


function Mode(props:any) {
    
    const { setComponent , globalSocket} = useContext(DataContext);
    function updateInof(){
        setComponent("templates");
        globalSocket.emit("Mode",props.name);
    }
    return (
        <div className="gap-4 rounded-xl" key={props.id}>
             <Card isFooterBlurred className="w-full h-[300px] col-span-12 sm:col-span-5" shadow={'lg'}>
  <CardHeader className="absolute z-10 top-1 flex-col items-start">
  </CardHeader>
 <Image isBlurred isZoomed alt="" src ={props.image} className="z-0 w-full h-full scale-125 -translate-y-6 object-cover" width={450} height={500}/>
  <CardFooter className="absolute bg-midnight-secondary/30 bottom-0 z-10 justify-between gap-1">
    <div>
      <p className="text-midnight">Play with {props.name}</p>
    </div>
    <Button className="text-midnight-secondary bg-midnight hover:bg-midnight-secondary hover:text-midnight"  radius="sm" size="sm" onClick={updateInof}>
    Play
    </Button>
  </CardFooter>
</Card>
</div> 
);
}

export default Mode


















