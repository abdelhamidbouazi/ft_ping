"use client";
import React, { useCallback, useContext } from "react";
import { Tabs, Tab } from "@nextui-org/react";
import ChannelsList from "../Channels/ListChannels/ChannelsList";
import ManageUserList from "../Channels/Users/ManageUserList";
import AddChannel from "../Channels/AddChannel";
import JoinChannel from "../Channels/JoinChannel";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { toast } from "react-toastify";
import { Button } from "@nextui-org/react";
import { DeleteChannel, LeaveChannel } from "@/utils/PostChannel";
import { useRouter } from "next/navigation";
import ListChannelInvites from "../Channels/Invites/ChannelInvites";
import InviteUserToGame from "../Channels/InviteUserToGame";
import { MdOutlineManageAccounts } from "react-icons/md";

import DirectList3 from "../DirectList";
import { getNotJoindChannelsUrlEndpoint, getChannelByIdURLEndpoint, getJoinedChannelsUrlEndpoint, getMyChannelsInvitesURLEndpoint } from "@/app/api/axios";
import { getBlockedUsers, getChannels, getJoinedChannels, getMyChannelsInvites } from "@/utils/getChannels";
import useSWR from "swr";
import get_me_fromClient from "@/utils/GET_me";
import { DataContext } from "@/components/Play/context";


export default function RightSection({ params }) {
  const {globalSocket} = useContext(DataContext);
  const router = useRouter();

  const [directUsername, setDirectUsername] = useState(
    params.username ? params.username : ""
  );
  const [channelId, setChannelId] = useState(params.id ? params.id : "");

  const [isAdmin, setIsAdmin] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const [usersTriger, setUsersTriger] = useState(false);
  const [openManage, setOpenManage] = useState(false);
  const [allowLeave, setAllowLeave] = useState(false);
  const [isLeaveSelected, setIsLeaveSelected] = useState(false);
  const [isDeleteSelected, setIsDeleteSelected] = useState(false);
  const [selectionTrigger, setSelectionTrigger] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(channelId);
  const [selectedTab, setSelectedTab] = useState(
    params.id ? "channels" : "contacts"
  );
  const [chId, setChId] = useState(params.id ? params.id : selectedChannel);
  useEffect(() => {
    setChId(selectedChannel);
  }, [selectedChannel]);

  const {
    isLoading: isLoadingChannels,
    error: errorChannels,
    data: channels,
    mutate: mutateAllChannels
} = useSWR(getNotJoindChannelsUrlEndpoint, getChannels);
    const {
      isLoading: isLoadingJoinedChannels,
      error: errorJoinedChannels,
      data: joinedChannels,
      mutate: mutateJoinedChannels
  } = useSWR(getJoinedChannelsUrlEndpoint, getJoinedChannels);
  const {
    isLoading: isLoadingChannelInvites,
    error: errorChannelInvites,
    data: channelInvites,
    mutate: mutateChannelInvites
} = useSWR(getMyChannelsInvitesURLEndpoint, getMyChannelsInvites);
const {
  isLoading: isLoadingChannelById,
  error: errorChannelById,
  data: channelById,
  mutate: mutateChannelById
} = useSWR(getChannelByIdURLEndpoint(chId), getBlockedUsers);

const {
  isLoading: isLoadingUsersMe,
  error: errorUsersMe,
  data: usersMe,
  mutate: mutateUsersMe
} = useSWR('/users/me', get_me_fromClient);

  useEffect(() => {
    setSelectionTrigger((prev) => !prev);
  }, [selectedChannel, trigger]);

  useEffect(() => {
    if (!isLoadingUsersMe && !isLoadingChannelById && channelById !== undefined && usersMe !== undefined) {
    const users = channelById.slice(1);
    const user = users.find((user) => user.username === usersMe.username);
    if (user && (user.role === "admin" || user.role === "owner")) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
      setOpenManage(false);
    }
  }
  }, [usersMe, selectedChannel, trigger, channelById, isLoadingChannelById, isLoadingUsersMe]);

  const channelTrigger = useCallback(() => {
    mutateAllChannels();
    mutateJoinedChannels();
    // toast.info("New channel created!");
}, [mutateAllChannels, mutateJoinedChannels, toast]);
  const deleteChannelTrigger = useCallback(() => {
    mutateAllChannels();
    mutateJoinedChannels();
    setIsAdmin(false)
    setIsLeaveSelected(false);
    setOpenManage(false);
    setAllowLeave(false);
    router.push("/chat");
    // toast.info("New channel created!");
}, [mutateAllChannels, mutateJoinedChannels, toast]);

  const updateChannelTrigger = () => {
    mutateAllChannels();
    mutateJoinedChannels();
    setTrigger((prev) => !prev);
  };
  const channelPPToast = () => {
    mutateAllChannels();
    mutateJoinedChannels();
    // toast.info("New NOOB joined!");
  };
  const channelPrToast = () => {
    mutateAllChannels();
    mutateJoinedChannels();
    // toast.info("New NOOB joined!");
  };

  const isCriticalEvent = () => {
    mutateAllChannels();
    mutateJoinedChannels();
    router.push("/chat");
    // toast.info("Critacal Event, input disabled!");
  };
  const DisableCritical = () => {
    mutateAllChannels();
    mutateJoinedChannels();
    router.push("/chat");
    // toast.info("input Enabled!");
  };
  const handleSelectedChannel = (selectedChannelProp) => {
    mutateAllChannels();
    mutateJoinedChannels();
    setSelectedChannel(selectedChannelProp);
  };



  useEffect(() => {
    if (globalSocket === null) return;
    globalSocket.emit("Login", { globalSocket: globalSocket.id });
    const joinmesg = {
      channelId: selectedChannel,
    };
    globalSocket.emit("join", joinmesg);

    globalSocket.on("createchannel", channelTrigger);
    globalSocket.on("deletechannel_event", deleteChannelTrigger);
    globalSocket.on("updateChannel", updateChannelTrigger);
    globalSocket.on("join_protected", channelPPToast);
    globalSocket.on("joinprivate_public", channelPrToast);

    globalSocket.on("mute_event", isCriticalEvent);
    globalSocket.on("kicked", isCriticalEvent);
    globalSocket.on("ban_event", isCriticalEvent);

    globalSocket.on("unmute_event", DisableCritical);
    globalSocket.on("unban_event", DisableCritical);

    globalSocket.on("inviteuser", () => {
      mutateChannelInvites();
      // toast.info("You got invited to a channel!");
    });

    // return () => {
    //   globalSocket.disconnect();
    // };
  }, [selectedChannel, DisableCritical, channelPPToast, channelPrToast, channelTrigger, isCriticalEvent, mutateChannelInvites, updateChannelTrigger, globalSocket]);

  
  const handleLeaveChannel = async () => {
    try {
      const data = await LeaveChannel(selectedChannel);
      // toast.success("Channel Created Successfully");
      mutateAllChannels();
      mutateJoinedChannels();
      toast.info("You left the channel!",
      {
          toastId: 'info1'
      })
      setIsAdmin(false)
      setIsLeaveSelected(false);
      setOpenManage(false);
      setAllowLeave(false);
      router.push("/chat");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message,
      {
          toastId: 'error1'
      })
    }
  };
  const handleDeleteChannel = async () => {
    try {
      const data = await DeleteChannel(selectedChannel);
      mutateAllChannels();
      mutateJoinedChannels();
      // toast.info("You deleted the channel!");
      setIsAdmin(false)
      setIsDeleteSelected(false);
      setAllowLeave(false);
      setOpenManage(false);
      router.push("/chat");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message,
      {
          toastId: 'error1'
      })
    }
  };

  return (
    <div className="pt-4">
      <Tabs
        fullWidth
        size="md"
        aria-label="Tabs form"
        selectedKey={selectedTab}
        onSelectionChange={(setSelectedTab) as any}
        color="default"
        variant="underlined"
        classNames={{
          tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider text-midnight-light px-2 md:max-w-lg mx-auto",
          cursor: "w-full bg-midnight-secondary",
          tab: "max-w-full px-0 h-12",
          tabContent: "group-data-[selected=true]:text-midnight-secondary",
        }}
      >
        <Tab key="contacts" title="Contacts">
          <div className="flex flex-col gap-4 h-2/3">
            <DirectList3 selectedDm={directUsername} />
          </div>
        </Tab>

        <Tab key="channels" title="Channels" className="items-center">
          <div className="flex flex-col gap-4 overflow-hidden max-w-full md:max-w-lg py-10 lg:h-[86vh] h-[55vh] midnight px-2 mx-auto bg-midnight border border-midnight-border shadow-xl rounded-lg pt-3 ">
            {!isLoadingJoinedChannels ? (
              <ChannelsList
                channels={joinedChannels}
                onChannelSelect={handleSelectedChannel}
                isSelected={setOpenManage}
                setAllowLeave={setAllowLeave}
              />
            ) : (
              <div className="text-midnight-secondary text-center">
                <span className="font-bold">YEHOOO</span>: Empty channels box,
                you will be the legacy room manager.
              </div>
            )}
            <div className=" mt-4 flex md:flex-col-reverse flex-row-reverse justify-center items-center md:gap-4 gap-2 w-full">
              {isAdmin && selectedChannel !== undefined && (
                <Button
                  className="bg-midnight border border-midnight-border text-midnight-secondary font-normal py-2 px-4 rounded-lg hover:bg-midnight-light hover:text-midnight w-full"
                  aria-label="Manage users"
                  startContent={<MdOutlineManageAccounts />}
                  size="sm"
                  onClick={() => {
                    setOpenManage((prev) => !prev);
                    setUsersTriger((prev) => !prev);
                  }}
                >
                  Manage Users
                </Button>
              )}
              <AddChannel
                mutateJoined={mutateJoinedChannels}
                mutateAllChannels={mutateAllChannels}
              />
              {channels && !isLoadingChannels ? (
                <JoinChannel
                  mutateJoinedChannels={mutateJoinedChannels}
                  channelsList={channels}
                  isLoadingChannels={isLoadingChannels}
                />
              ) : (
                <span>Loading..</span>
              )}
            </div>
            <div className="">
              {isAdmin && openManage && selectedChannel !== undefined && (
                <ManageUserList
                  
                  channelId={selectedChannel}
                  Strigger={selectionTrigger}
                  isSelected={""}
                />
              )}
            </div>
            {channelInvites !== undefined && !isLoadingChannelInvites && channelInvites.length > 0 && (
              <div className="midnight border border-midnight-border rounded-xl items-center px-4 ">
                <div className="text-center text-slate-200 py-2">Invites</div>
                <div className="py-3">
                  <ListChannelInvites
                    invites={channelInvites}
                    mutateChannelInvites={mutateChannelInvites}
                  />
                </div>
              </div>
            )}
            <InviteUserToGame
              socket={globalSocket}
            />
            {(selectedChannel !== undefined && allowLeave)&& (
              <div className="border border-midnight-border  rounded-lg ">
                <div className="py-2 px-4 flex flex-col gap-1">
                  {selectedChannel !== undefined && (
                    <>
                      {isLeaveSelected ? (
                        <>
                          {" "}
                          <div className="flex flex-col items-center">
                            <div className="text-slate-200 font-bold">
                              Are you sure you want to{" "}
                              <span className="font-extrabold text-slate-200 bg-orange-600">
                                LEAVE
                              </span>{" "}
                              this channel?
                            </div>
                            <div className="flex flex-row py-4">
                              <Button
                                color="success"
                                className="text-slate-200"
                                variant="light"
                                onClick={() => {
                                  setIsLeaveSelected((prev) => !prev);
                                 
                                }}
                              >
                                No STAY
                              </Button>
                              <Button
                                color="danger"
                                variant="light"
                                onClick={handleLeaveChannel}
                              >
                                Yes LEAVE CHANNEL
                              </Button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="light"
                            onClick={() => {
                              setIsLeaveSelected((prev) => !prev);
                              
                            }}
                            color="warning"
                          >
                            Leave channel
                          </Button>
                        </>
                      )}
                    </>
                  )}
                  {selectedChannel !== undefined && isAdmin && (
                    <>
                      {isDeleteSelected ? (
                        <>
                          {" "}
                          <div className="flex flex-col items-center">
                            <div className="text-slate-200 font-bold">
                              Are you sure you want to{" "}
                              <span className="font-extrabold text-slate-200 bg-red-600">
                                DELETE
                              </span>{" "}
                              this channel?
                            </div>
                            <div className="flex flex-row py-4">
                              <Button
                                color="success"
                                className="text-slate-200"
                                variant="light"
                                onClick={() => {
                                  setIsDeleteSelected((prev) => !prev);
                                  setOpenManage((prev) => !prev);
                                }}
                              >
                                No Cancel
                              </Button>
                              <Button
                                color="danger"
                                variant="light"
                                onClick={handleDeleteChannel}
                              >
                                Yes DELETE CHANNEL
                              </Button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="light"
                            onClick={() => {
                              setIsDeleteSelected((prev) => !prev);
                            }}
                            color="danger"
                          >
                            Delete channel
                          </Button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
