import React, { useContext, useEffect, useState } from 'react'
import axios from '@/app/api/axios';
import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { Button } from '@nextui-org/react';
import { DataContext } from '@/components/Play/context';

export default function HandleFriendButton({username}) {

    const {globalSocket} = useContext(DataContext);

    const [isFriend, setIsFriend] = useState<boolean>(false);
    const [isPending, setIsPending] = useState<boolean>(false);
    const [trigger, setTrigger] = useState<boolean>(false);
    const [isBlocked, setIsBlocked] = useState<boolean>(false);


    async function checkIfUserBlocked(username) {
      try {
        const response = await axios.get(`/users/blocked/Users`, {
          withCredentials: true,
        });

        const friendUsernames = response.data.map((friend) => friend.username);
        const checkIsBlocked = friendUsernames.includes(username);
        setIsBlocked(checkIsBlocked);
        return checkIsBlocked;
      } catch (error) {
        throw error;
      }
    }
    
    const handleAddFriend = async () => {
      try{
        const userBlocked = await checkIfUserBlocked(username);
        if (userBlocked == true) {
          toast.error("You are blocked by this user",
          {
              toastId: 'error1'
          })
          return ;
      }
        const response = await axios.post(`/friends/sendarequest/${username}`, {
          withCredentials: true,
        });
        if(!response.data.success)
          toast.error(`${response.data.message}`,
          {
              toastId: 'error1'
          })
        setTrigger(prev => !prev);
      } catch (error) {
        setTrigger(prev => !prev);
        toast.error(error.response.data.message,
          {
              toastId: 'error1'
          })
      }
    }

    async function handleCancelRequest() {
      try {
        await axios.put(`/friends/cancel/${username}`, {
          withCredentials: true,
        });
        setTrigger(prev => !prev);
      } catch (error) {
        console.log("Error canceling friend request");
        setTrigger(prev => !prev);
        toast.error(error.response.data.message,
          {
              toastId: 'error1'
          })
      }
    }
    async function handleRemoveFriend() {
      if (isFriend === false) {
        setTrigger(prev => !prev);
        return;
      }
      try {
        await axios.delete(`/friends/unfriend/${username}`, {
          withCredentials: true,
        });
        setTrigger(prev => !prev);
      } catch (error) {
        setTrigger(prev => !prev);
        toast.error("Error unfriending user",
        {
            toastId: 'error1'
        })
      }
    }
    
    useEffect(() => {
      
      if (globalSocket === null) return;
      globalSocket.on("new_friend_request", () => {
        setTrigger(prev => !prev);
      })
      globalSocket.on("cancel_request", () => {
        setTrigger(prev => !prev);
      })
      globalSocket.on("accept_request", () => {
        setTrigger(prev => !prev);
      })
      globalSocket.on("reject_request", () => {
        setTrigger(prev => !prev);
      })

      async function handlePendingRequest(username) {
        try {
          const res = await axios.get(`/friends/pending_i_sent`, {
            withCredentials: true,
          });
          const checkIsPending = res.data.some(item => item.receiver === username || item.sender === username);
          setIsPending(checkIsPending);
          return isPending;
        } catch (error) {
          toast.error("Error canceling friend request",
          {
              toastId: 'error1'
          })
        }
      }
        async function getFriends(username) {
            try {
              const response = await axios.get(`/friends/My_Friends`, {
                withCredentials: true,
              });
        
              const friendUsernames = response.data.map((friend) => friend.username);
              const checkIsFriend = friendUsernames.includes(username);

            if (checkIsFriend) {
                setIsFriend(true);
            }
            else {
                setIsFriend(false);
            }
            } catch (error) {
              console.log("Error checking friend status:", error);
              return false;
            }
          }
          getFriends(username);
          handlePendingRequest(username);
          checkIfUserBlocked(username);
          // return () => {
          //   globalSocket.disconnect();
          // };
    }, [username, trigger, globalSocket])


  return (
    <div >
      {
        (isFriend === false && isPending === false && isBlocked !== true) && <Button onClick={handleAddFriend}>Add Friend</Button>
      }
      {
        (isFriend === true && isPending === false && isBlocked !== true) && <Button onClick={handleRemoveFriend}>Remove Friend</Button> 
      }
      {
        (isPending === true && isFriend === false && isBlocked !== true) && <Button onClick={handleCancelRequest}>cancel request</Button>
      }

    </div>
  )
}