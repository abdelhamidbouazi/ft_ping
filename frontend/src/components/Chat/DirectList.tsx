import React, { useEffect, useState } from "react";
import {
  Select,
  SelectItem,
  Avatar,
  SelectedItems,
  Button,
  ScrollShadow,
} from "@nextui-org/react";
import get_Chats from "@/utils/get_Chat";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import NewMessagesButton from "./NewMessagesButton";
import useSWR from "swr";
import Invite from "../Play/Game/invite";

export default function DirectList3({ selectedDm }) {
  const {
    isLoading: isLoadingUserDms,
    error: errorUserDms,
    data: userDms,
    mutate: mutateUserDms
} = useSWR('/chat/getdmsorgnized', get_Chats);
    // //console.log("selectedDm", selectedDm);
  // const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isExist, setIsExist] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (userDms === undefined || userDms.length === 0) return;
    // //console.log("userDms: ", userDms);
    const user = userDms.find((user) => user.username === selectedDm);
    if (user) {
        setSelectedKey(user.id);
      setIsExist(true);
    }
  }, [userDms, selectedDm]);
  const [selectedKey, setSelectedKey] = useState(isExist ? [selectedDm] : []);

  useEffect(() => {

    // //console.log("userDms : ", userDms);
    // if (selectedKey == null) router.push(`/chat`);
    // else {
    //   // //console.log("selected key: ", selectedKey.size);
    // if (selectedKey.size === 0) {
    //   router.push(`/chat/direct/${selectedKey.size}`);
    // }
    // }
    // const selectedKeyArray = Array.from(selectedKey);
    // This will log the first element of the Set
    // setSelectedUser(selectedKeyArray[0]);
  }, [selectedKey, userDms]);
  

  return (
    <>
      {(userDms && userDms !== undefined && userDms.length !== 0) ? (
        <div className=" lg:h-[86vh] h-[27vh] px-2 pt-3 ">
          <div className="max-w-full mx-auto border bg-midnight border-midnight-border h-full rounded-lg overflow-hidden md:max-w-lg  shadow-xl">
            <div className="md:flex overflow-auto">
              <div className="w-full p-4 ">
                <div className="relative">
                  <NewMessagesButton />
                </div>
                <ul className="py-6 ">
                <ScrollShadow hideScrollBar>
                  {userDms !== undefined && Array.isArray(userDms) && userDms.map((user) => (
                    <li
                      key={user.id}
                      className={`flex justify-between items-center  mt-2 p-2 rounded-xl border  ${selectedKey === user.id ? 'border-midnight-secondary text-midnight-secondary' : 'border-midnight-border hover:bg-midnight-secondary '} hover:shadow-lg cursor-pointer transition`}
                    >
                        <Link href={`/chat/direct/${user.username}`} onClick={() => {setSelectedKey(user.id)}}>
                        <div className="flex flex-row pl-2 items-center justify-center">
                          <Avatar
                            alt={user.displayName}
                            className="flex-shrink-0"
                            size="sm"
                            src={user.Avatar_URL}
                          />
                          <div className="flex flex-col pl-2">
                            <span className="font-medium text-slate-200">
                              {user.displayName}
                            </span>
                            <span className="text-tiny text-midnight-light">
                              @{user.username}
                            </span>
                            {/* <span className="text-sm text-gray-400 truncate w-32">
                                Hey, Joel, I here to help you out please tell me
                            </span> */}
                          </div>
                        </div>
                            </Link>
                      <div className="flex flex-col items-center">
                      <Invite username2={user.username} className="h-8 w-20 rounded-lg text-midnight-secondary border border-midnight-border  font-normal hover:bg-midnight-secondary hover:text-midnight-light active:bg-violet-700 focus:outline-none " />
                      </div>
                    </li>
                  ))}
                  </ScrollShadow>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col p-2 gap-6 text-midnight-secondary text-center">
          No conversations ? let&apos;s start a new conversation.
          <NewMessagesButton />
        </div>
      )}
    </>
  );
}
