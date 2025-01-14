"use client";
import React, { useEffect, useState } from "react";
import axios from "@/app/api/axios";
import get_me_fromClient from "@/utils/GET_me";
import { Avatar } from "@chakra-ui/react";
import Link from "next/link";
import History from "./History";
import Achievement from "./Achievement/Achievement";
import { Button } from "@nextui-org/react";

type Mydata = {
  id: string;
  nickname: string;
  displayName: string;
  Avatar_URL: string;
  achievements: string[];
  isSettingSetted: boolean;
  isTwoFactorEnable: boolean;
  is_looged: boolean;
  ladder_lvl: number;
  username: string;
  wins: number;
  total_matches: number,
  loses: number,
};

const ProfileContent = ({ nickname, username, me }) => (
  <div className="rounded-lg bg-midnight border border-midnight-border px-8 py-5">
    <div className="flex justify-between items-center mb-4">
      <p className="text-center text-2xl font-bold md:text-left text-midnight-secondary">
        Profile
        <span className="text-sm font-light text-midnight-light">
          {" "}
          (level {(me.ladder_lvl.toFixed(2))})
        </span>
      </p>
    </div>
    <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
      <div className="overflow-hidden rounded-full">
        <Avatar name={me.displayName} src={me.Avatar_URL} size="2xl" />
      </div>
      <div className="flex-1 border-spacing-5 space-y-4 border-amber-200 dark:bg-neutral-600">
        <div className="h-4 rounded-xl bg-neutral-200 relative">
          <div className="absolute z-10 bottom-0 left-1/2 text-[13px] text-midnight-secondary"> 
            {`${(me.ladder_lvl * 10 >= 100 ? "100" : `${(me.ladder_lvl * 10).toFixed(2)}`)}%`}
          </div>
          <div
            className="text-primary-100 h-4 rounded-xl bg-midnight-light text-center text-base font-medium leading-none"
            style={{
              width: `${
                me.ladder_lvl * 10 >= 100 ? "100" : `${me.ladder_lvl * 10}`
              }%`,
            }}
          ></div>
        </div>
        <div className="flex  items-center justify-between gap-2">
          <p className="flex flex-coltext-sm font-medium sm:text-lg text-midnight-secondary">
            {username} <br /> @{nickname}
          </p>
          <Link href="/settings">
            <Button className="text-midnight-secondary border border-midnight-border bg-midnight hover:bg-midnight-secondary hover:text-midnight hover:border-midnight-secondary">
              Edit Profile
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </div>
);

const Progress = (props) => {
  const [me, set_ME] = useState<Mydata>({
  id: '',
  nickname: '',
  displayName: '',
  Avatar_URL: '',
  achievements: [],
  isSettingSetted: false,
  isTwoFactorEnable: false,
  is_looged: false,
  ladder_lvl: 0,
  username: '',
  wins: 0,
  total_matches: 0,
  loses: 0,

  });
  useEffect(() => {
    async function get_data_of_me() {
      const user = await get_me_fromClient();
      set_ME(user);
    }

    get_data_of_me();
  }, []);

  return (
    <ProfileContent username={me.username} nickname={me.nickname} me={me} />
  );
};

const Profile = () => {
  const [user, setUser] = useState<Mydata>({
    id: '',
    nickname: '',
    displayName: '',
    Avatar_URL: '',
    achievements: [],
    isSettingSetted: false,
    isTwoFactorEnable: false,
    is_looged: false,
    ladder_lvl: 0,
    username: '',
    wins: 0,
    total_matches: 0,
    loses: 0,
    });
  const [username, setUsername] = useState("");
  const [gameHistory, setGameHistory] = useState<Mydata>({
    id: '',
    nickname: '',
    displayName: '',
    Avatar_URL: '',
    achievements: [],
    isSettingSetted: false,
    isTwoFactorEnable: false,
    is_looged: false,
    ladder_lvl: 0,
    username: '',
    wins: 0,
    total_matches: 0,
    loses: 0,
  });

  useEffect(() => {
    axios
      .get("/users/me")
      .then(({ data }) => {
        setUsername(username);
        setUser(data);
        axios
          .get(`/game/history/${data.username}`)
          .then((gameHistoryData) => {
            setGameHistory(gameHistoryData.data);
          })
          .catch((error) => {
            console.log("Error fetching game history:", error);
          });
      })
      .catch((err) => {});
  }, []);

  return (
    <div className="h-full w-full rounded-lg  p-2  flex flex-col gap-8">
      <p className="p-3 text-center font-mono text-2xl md:text-left text-midnight-secondary text-gaming">
        Welcome <span>{user.displayName}</span>!
      </p>
      <div className="flex w-full flex-col">
        <Progress />
      </div>
      <div className="flex w-full h-72 flex-col rounded-lg bg-midnight border border-midnight-border">
        <p className="p-5 px-8 text-2xl font-bold text-midnight-secondary">
          Game History
          <span className="text-sm font-light text-midnight-light"> ({user.wins}/{user.total_matches} Matches)</span>
        </p>
        <div className="scrollbar-gray-500 flex w-full h-full flex-col gap-2 max-h-[80%] overflow-y-scroll px-8 scrollbar-thin scrollbar-thumb-midnight-secondary">
          {user.username !== undefined && <History user={user} />}
        </div>
      </div>
      <div className="flex w-full lg:h-3/5 flex-col rounded-lg bg-midnight border border-midnight-border">
        <p className="p-5 px-8 text-2xl font-bold text-midnight-secondary">
          Achievement
        </p>
        <div className="scrollbar-gray-500 flex h-full w-full justify-between gap-5 px-6 md:pt-6 overflow-scroll scrollbar-thin scrollbar-thumb-midnight-secondary">
          {user.username !== undefined && <Achievement user={user} />}
        </div>
      </div>
    </div>
  );
};

export default Profile;
