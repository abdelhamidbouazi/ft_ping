"use client";
import React, { useContext } from "react";

import { useState, useEffect } from "react";
import axios from "@/app/api/axios";
import { Avatar } from "@chakra-ui/react";
import { DataContext } from "@/components/Play/context";
import Invite from "@/components/Play/Game/invite"

const Content = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const {globalSocket} = useContext(DataContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/friends/My_Friends");
        setFriends(response.data);
        setLoading(false);
      } catch (error) {
        console.log("Error fetching friend data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);




  useEffect(() => {
    if (globalSocket === null) return;
    globalSocket.on("blocking_update", (updatedBlocking) => {
      const friendArray = friends.filter((friend) => friend.id !== updatedBlocking);
      setFriends(friendArray);
    });
  }, [globalSocket]);
  
  useEffect(() => {
    if (globalSocket === null) return;
    const handleAcceptRequest = () => {
      
      const fetchData = async () => {
        try {
          const response = await axios.get("/friends/My_Friends");
          setFriends(response.data);
          setLoading(false);
        } catch (error) {
          console.log("Error fetching friend data:", error);
          setLoading(false);
        }
      };
      fetchData();
    };
    
    globalSocket.on("accept_request", handleAcceptRequest);
    return () => {
      globalSocket.off("accept_request", handleAcceptRequest);
    };
  }, [globalSocket, friends]);
  
  useEffect(() => {
    if (globalSocket === null) return;
    const handleUnfriend = () => {

      const fetchData = async () => {
        try {
          const response = await axios.get("/friends/My_Friends");
          setFriends(response.data);
          setLoading(false);
        } catch (error) {
          console.log("Error fetching friend data:", error);
          setLoading(false);
        }
      };
      fetchData();
    };

    globalSocket.on("unfriend_event", handleUnfriend);
    return () => {
      globalSocket.off("unfriend_event", handleUnfriend);
    };
  }, [globalSocket, friends]);


  function handleInvite(InvitedUsername: string){
    globalSocket.emit('Invite', { username1: '', username2: InvitedUsername });
    // //console.log("invite called ...");
  }

  return (
    <div>
      {loading ? (
        <p>Searching for any friends...</p>
      ) : (
        <div>
          { friends && friends.map((friend) => (
            <div
              key={friend.id}
              className="mb-2 flex items-center justify-between rounded-2xl border border-midnight-border hover:bg-midnight-light"
            >
              <div className="flex items-center p-2">
                <Avatar name={friend.displayName} src={friend.Avatar_URL} />
                <div className="ml-2 text-midnight-secondary hover:text-midnight-secondary">
                  {friend.username}
                </div>
              </div>
              <div className="mr-4">
                <button className="h-8 w-20 rounded-lg text-midnight-secondary border border-midnight-border  font-normal hover:bg-midnight-secondary hover:text-midnight-light active:bg-violet-700 focus:outline-none" onClick={()=> {
                  handleInvite(friend.username);
                }}>
                    Invite
                    {/* <Invite username2={friend.username} className="h-8 w-20 rounded-lg text-midnight-secondary border border-midnight-border  font-normal hover:bg-midnight-secondary hover:text-midnight-light active:bg-violet-700 focus:outline-none " /> */}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Content;
