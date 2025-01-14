"use client";
import React, { useState, useEffect, useContext } from "react";
import get_me_fromClient from "@/utils/GET_me";
import io from "socket.io-client";
import { Avatar, Skeleton } from "@nextui-org/react";
import Notifications from "./Navbar/Notifications";
import UserSearch from "./Navbar/Search";
import { DataContext } from "@/components/Play/context";

function Navbar() {
  type USER = {
    id: number;
    nickname: string;
    username: string;
    is_logged: boolean;
    Avatar_URL: string;
    status: string;
    wins: number;
    losses: number;
    achievements: string[];
    ladder_lvl: number;
  };

  const [me, set_ME] = useState<USER>();
  
  const {globalSocket} = useContext(DataContext);
  useEffect(function () {
    if (globalSocket === null) return;
    globalSocket.emit("Login", { socket: globalSocket.id });
    globalSocket.on("update_is_done", () => {
      // //console.log("me>>>>>");
      get_data_of_me();
    });
    async function get_data_of_me() {
      const user = await get_me_fromClient();
      set_ME(user);
    }
    get_data_of_me();
  }, [globalSocket]);

  return (
    <section>

    <div className="flex items-center justify-between flex-shrink-0 h-16 px-8 border-b border-midnight-border bg-midnight">
      <h1 className="text-lg font-medium text-midnight-secondary">POONGERS</h1>
      <div className="flex flex-row gap-2">
        {globalSocket && <Notifications />}
        {globalSocket && <UserSearch socket={globalSocket}/>}
      </div>
      <div className="flex items-center justify-between w-10 h-10 rounded hover:bg-gray-300">
        <div className="flex flex-row items-start">
        {me ? <Avatar src={me.Avatar_URL} alt={me.username}/> : <Skeleton className="flex rounded-full w-12 h-12"/>}        
        </div>
      </div>
  </div>
    </section>
  );
}

export default Navbar;
