"use client";
import React, { useContext } from "react";
import { useState, useEffect } from "react";
import axios from "@/app/api/axios";
import { Avatar } from "@chakra-ui/react";
import { toast } from "react-toastify";
import { DataContext } from "@/components/Play/context";

const Rank = () => {
  const [friends, setFriends] = useState([]);

  const {globalSocket} = useContext(DataContext);
  useEffect(() => {
    if (!globalSocket) return ;
    const fetchData = async () => {
      try {
        const response = await axios.get(`/game/ranking`, {
          withCredentials: true,
          });
        setFriends(response.data);
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message,
        {
            toastId: 'error1'
        })
      }
    };
    fetchData();

    globalSocket.on("ranking_update", (updatedRanking) => {
      toast.info("The ranking has been updated!",
      {
          toastId: 'info1'
      })
      fetchData();
      setFriends(updatedRanking);
    });

  }, [globalSocket]);

  return (
    <>
      {friends.map((friendGroup, index) => (
        <tr key={index} className="bg-midnight-light">
          <td className="whitespace-nowrap p-3 text-sm text-gray-700">
            <a href="#" className="font-bold  hover:underline">
              {index + 1}
            </a>
          </td>
          <td className="flex whitespace-nowrap p-3 text-sm text-gray-700 w-36">
            <Avatar
              key={index}
              src={friendGroup?.[2]}
              className="rounded-full"
              height={10}
              width={10}
            />
            <p className="p-2">{friendGroup?.[1]}</p>
          </td>
          <td className="whitespace-nowrap p-3 text-sm text-gray-700">{(friendGroup?.[0]).toFixed(2)}</td>
          <td className="whitespace-nowrap p-3 text-sm text-gray-700">{(friendGroup?.[0] *10).toFixed(2)}%</td>
        </tr>
      ))}
    </>
  );
};

export default Rank;
