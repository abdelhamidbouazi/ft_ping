"use client";
import React, { useContext } from "react";
import { Avatar } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "@/app/api/axios";
import { DataContext } from "@/components/Play/context";
import { toast } from "react-toastify";

const History = ({ user }) => {
  const [history, setHistory] = useState({
    player1: "",
    player1_avatar: "",
    player2: "",
    player2_avatar: "",
    score_player1: 0,
    score_player2: 0,
  });
  const [loading, setLoading] = useState(true);

  const {globalSocket} = useContext(DataContext);

  useEffect(() => {
    if (globalSocket === null) return;
    globalSocket.on("ranking_update", () => {
      get_history();
    });
    async function get_history() {
      try {
        if (user.username) {
          const response = await axios.get(`/game/history/${user.username}`, {
            withCredentials: true,
          });
          setHistory(response.data);
          setLoading(false);
        }
      } catch (err) {
        toast.error(err?.response?.data?.message || err.message,
          {
            toastId: 'error1'
        })
      }
    }
   get_history();
  }, [user, globalSocket]);

  return (
    <>
      {history !== undefined && Array.isArray(history) &&
        history.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between w-full rounded-2xl border border-midnight-border p-4"
          >
            <div className="flex items-center justify-center">
              <Avatar
                src={item.player1_avatar}
                className="rounded-full"
                height={10}
                width={10}
              />
            </div>
            <p className="text-midnight-light">{item.player1}</p>
            <p className="text-midnight-secondary">{item.score_player1}</p>
            <p className="text-midnight-light">-</p>
            <p className="text-midnight-secondary">{item.score_player2}</p>
            <p className="text-midnight-light">{item.player2}</p>
            <div className="flex items-center justify-center">
              <Avatar
                src={item.player2_avatar}
                className="rounded-full"
                height={10}
                width={10}
              />
            </div>
          </div>
        ))}
    </>
  );
};

export default History;
