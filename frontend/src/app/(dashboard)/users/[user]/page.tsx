"use client";
import React, { useContext } from "react";
import History from "@/components/Cards/History";
import Achievement from "@/components/Cards/Achievement/Achievement";
import { useEffect, useState } from "react";
import axios from "@/app/api/axios";
import { Avatar } from "@chakra-ui/react";
import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import HandleFriendButton from "@/components/Button/HandleFriendButton";
import get_me_fromClient from "@/utils/GET_me";
import { DataContext } from "@/components/Play/context";

type Mydata = {
  id: number,
  username: string,
  nickname: string,
  achievements: string[],
  ladder_lvl: number,
  status: string,
  Avatar_URL: string
  displayName: string,
  wins: number,
  loses: number,
  total_matches: number,
};

const Progress = (props) => {
  
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const [trigger, setTrigger] = useState<boolean>(false);
  const {globalSocket} = useContext(DataContext);

  async function checkIfUserBlocked(username: any) {
    try {
      const response = await axios.get(`/users/blocked/Users`, {
        withCredentials: true,
      });

      const friendUsernames = response.data.map((friend: any) => friend.Blocked_one_id);
      const checkIsBlocked = friendUsernames.includes(username);
      setIsBlocked(checkIsBlocked);
    } catch (error) {
      console.log("Error checking blocking status:", error);
      return false;
    }
  }

  async function handleBlock() {
    try {
      await axios.delete(`/users/block/${props.username}`, {
        withCredentials: true,
      }).then((res) => {
       if (!res.data.success)
        toast.error(`${res.data.message}`,
        {
            toastId: 'error1'
        })
      }
      );
      setIsBlocked(true);
      globalSocket.on("blocking_update", () => {
        toast.info("The blocking has been updated!",
        {
            toastId: 'info1'
        })
        setIsBlocked(true);
      }
      );
      toast.success("User blocked successfully",
      {
          toastId: 'success1'
      })
      } catch (error) {
      toast.error(error.response.data.message,
      {
          toastId: 'error1'
      })
    }
  }

  async function handleUnblock() {
    try {
      
      await axios.delete(`/users/unblock/${props.username}`, {
        withCredentials: true,
      });
      setIsBlocked(false);
      globalSocket.on("blocking_update", () => {
        toast.info("The blocking has been updated!",
        {
            toastId: 'info1'
        })
        setIsBlocked(false);
      }
      );
      toast.success("User unblocked successfully",
      {
          toastId: 'success1'
      })
    } catch (error) {
      setTrigger(prev => !prev);
      toast.error("Error unblocking user",
      {
          toastId: 'error1'
      })
    }
  }

 useEffect(() => {
  checkIfUserBlocked(props.id);
},[props.username]);

  return (
    <div className="rounded-lg bg-midnight border border-midnight-border px-8 py-5">
      <div className="flex justify-between items-center mb-4">
        <p className="text-center text-2xl font-bold md:text-left">
          {" "}
          Profile{" "}
          <span className="text-sm font-light">(level {(props.level.toFixed(2))})</span>
        </p>
       
          <span className={`inline-flex items-center  border ${props.status === 'offline' ? 'bg-red-200 border-red-700' : props.status === 'online' ? 'bg-green-200 border-green-700' : 'bg-yellow-200 border-yellow-600'} border-midnight-border text-midnight-secondary text-xs font-medium px-2.5 py-0.5 rounded-full `}>
            <span className={`w-2 h-2 me-1 ${props.status === 'offline' ? 'bg-red-700 ' : props.status === 'online' ? 'bg-green-700' : 'bg-yellow-600'} rounded-full`}></span>
            {props.status}
          </span>
      </div>
      <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
        <div className=" overflow-hidden rounded-full">
          <Avatar src={props.avatar} size="2xl" />
        </div>

        <div className="flex-1 border-spacing-5 space-y-4 border-amber-200 dark:bg-neutral-600">
          <div className="h-4 rounded-xl border border-midnight-border relative">
            <div className="absolute z-10 left-1/2 text-[13px] text-midnight-secondary">
            {`${(props.level * 10 >= 100 ? '100' : (props.level * 10).toFixed(2))} %`}

            </div>
             <div
              className="text-primary-100 h-4 rounded-xl bg-midnight-secondary text-center text-base font-medium leading-none"
              style={{ width: `${props.level *10 >= 100 ? '100' : `${props.level *10}` }%` }}>
            </div>
          </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium sm:text-lg">
            {props.nickname}
            <br /> @{props.username}
          </p>
          <div className="flex flex-row gap-2">
            <HandleFriendButton username={props.username} />
          <div>
              {
                (isBlocked === false) ? <button onClick={handleBlock} className="bg-midnight-secondary text-white px-4 py-2 rounded-lg">Block</button> 
                :
                <button onClick={handleUnblock} className="bg-midnight-secondary text-white px-4 py-2 rounded-lg">Unblock</button>
              }
             </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Profile = ({ params }) => {
  const [status, setStatus] = useState<'online' | 'offline' | 'Gaming'>("offline");
  const [user, setUser] = useState<Mydata>({
    id: 0,
    username: '',
    nickname: '',
    achievements: [],
    ladder_lvl: 0,
    status: '',
    Avatar_URL: '',
    displayName: '',
    wins: 0,
    loses: 0,
    total_matches: 0,
    });

  useEffect(() => { 
    async function fetcher() {
      const currentUser = await get_me_fromClient();
      if (currentUser.username === params.user){
      }
      axios
        .get(`/users/${params.user}`)
        .then(({ data }) => {
          setUser(data);
          setStatus(data.status);
        })
        .catch((error) => {
          toast.error(error.response.data.message,
            {
              toastId: 'error1'
          })
        });
    }
    fetcher();
  }, []);

  useEffect(() => {
    axios
      .get(`/game/history/${params.user}`)
      .then(({ data }) => {
        setUser((prev) => ({ ...prev, history: data }));
      })
      .catch((err) => {
        toast.error(err.response.data.message,
          {
            toastId: 'error1'
        })
      });
  }, []);

  return (
    <div className="h-full w-full rounded-lg  p-2 text-midnight-secondary flex flex-col items-center gap-8">
      <div className=" flex flex-col  gap-10 w-4/5">

      <p className="p-3 text-center font-mono text-2xl md:text-left text-midnight-secondary">
        <span>{user.displayName}`s</span> profile
      </p>
      <div className="flex w-full flex-col">
        <Progress
          displayName={user.displayName}
          username={user.username}
          id={user.id}
          nickname={user.nickname}
          level={user.ladder_lvl}
          avatar={user.Avatar_URL}
          status={status}
          wins={user.wins}
          total_matches={user.total_matches}
          loses={user.loses}
        />
      </div>
      <div className="flex w-full flex-col">
      </div>
      <div className="flex w-full h-72 flex-col rounded-lg bg-black border border-midnight-border">
        {user ? (
          <>
            <p className="p-5 px-8 text-2xl font-bold">
              Game History{" "}
              <span className="text-sm font-light">

                ({user.wins}/{user.total_matches} Wins)
              </span>
            </p>
            <div className="scrollbar-gray-500 flex w-full h-full flex-col gap-2 max-h-[80%] overflow-y-scroll px-8 scrollbar-thin scrollbar-thumb-[#413f3f]">
              {user.username !== undefined && <History user={user} />}
            </div>
          </>
        ) : (
          <div>loading..</div>
        )}
      </div>
      <div className="flex w-full  h-72 flex-col rounded-lg bg-black">
        <p className="p-5 px-8 text-2xl font-bold">
          Achievement{" "}
          <span className="text-sm font-light">(5/10 received)</span>
        </p>
        <div className="px-10 scrollbar-gray-500 flex h-full w-full justify-between gap-5 overflow-scroll scrollbar-thin scrollbar-thumb-[#413f3f]">
          {user.username !== undefined && <Achievement user={user} />}
        </div>
      </div>
      </div>
    </div>
  );
};

export default Profile;