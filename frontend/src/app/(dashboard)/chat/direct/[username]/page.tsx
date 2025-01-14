"use client";
import { useContext, useState } from "react";
import io from "socket.io-client";
import { useEffect } from "react";
import Converstation from "@/components/Chat/Conversation";
import { getDirectMessages } from "@/utils/getMessages";
import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

let sender: string;

import React, { useCallback } from "react";
import { getAllUsers } from "@/utils/getUsers";
import useSWR from "swr";
import axios, { getDirectMessagesURLEndpoint } from "@/app/api/axios";
import { DataContext } from "@/components/Play/context";

export default function Dm({ params }) {
  const [userInput, setUserInput] = useState("");
  const [rec, setRec] = useState(null);
  const [recName, setRecName] = useState(null);
  const [recUsername, setRecUsername] = useState(null);

  const {globalSocket} = useContext(DataContext);

  const {
    isLoading: isLoadingMessages,
    error: errorMessages,
    data: messages,
    mutate: mutateMessages
} = useSWR(getDirectMessagesURLEndpoint(params.username), getDirectMessages);

  const fetchMessages = useCallback(async () => {
    try {
      
      const friendsData = await getAllUsers()
		const user = friendsData.find((user: any) => user.username === params.username);
		
		if (user) {
		  try {
			mutateMessages();
    } catch (error) {
      toast.error("Cannot fetch messages!",
      {
          toastId: 'error1'
      })
    }
  } else {
    toast.info("No such user!",
    {
        toastId: 'info1'
    })
  }
  
} catch (error) {
  toast.error("Cannot fetch messages!",
  {
      toastId: 'error1'
  })
}
mutateMessages();
  }, [params.username]);

  useEffect(() => {
    if (messages && messages.length > 0) {
      messages.forEach((message) => {
        setRec(message.at(0).Avatar_URL);
        setRecName(message.at(0).displayName);
        setRecUsername(message.at(0).username);
      });
    }
  }, [messages]);

  useEffect(() => {
    
    if(globalSocket === null) return;
    
    globalSocket.on("received_message", () => {
      mutateMessages();
    });
    globalSocket.on("sent_dm", () => {
      mutateMessages();
    });
    
  }, [fetchMessages, globalSocket]);
  
  const handleClick = useCallback(async () => {
    // //console.log("==============globalSocket============", globalSocket);
    if (globalSocket === null) {
      // //console.log("Socket Error2!");
      return;
    }


    const getSender = async () => {
      await fetchMessages();
      const res = await axios.get(`/users/me`, {
        withCredentials: true,
      });
      sender = res.data.username;
    };
    await getSender();
    if (!sender) return ;


    if (userInput.length > 299) {
      toast.info("Message too long",
      {
          toastId: 'info1'
      })
      return;
    }
    try {
      // //console.log("----Sender----", sender);
      const message = {
        sender: sender,
        receiver: params.username,
        text: userInput,
      };
      if (userInput === "") {
        toast.info("Cannot send empty message!",
        {
            toastId: 'info1'
        })
        return;
      }
      if (globalSocket === null) {
        // //console.log("Socket Error!");
        // toast.error("Socket Error!");
        return;
      }
      // //console.log("handleClick");
      globalSocket.emit("sent_dm", message);
        await fetchMessages();
        setUserInput("");
      } catch (error) {
        toast.error("Cannot fetch messages!",
        {
            toastId: 'error1'
        })
      }
  }, [userInput, params.username, globalSocket, sender]);

  return (
    <main className="px-4 md:px-10">
      <Converstation
        params={params}
        messages={messages}
        userInput={userInput}
        setUserInput={setUserInput}
        handleClick={handleClick}
        Avatar={rec}
        name={recName}
        username={recUsername}
      />
    </main>
  );
}
