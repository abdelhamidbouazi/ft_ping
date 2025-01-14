"use client";
import { useState, useCallback, useRef, useContext } from "react";
import io from "socket.io-client";
import { useEffect } from "react";
import { Avatar } from "@chakra-ui/react";
import { getChMessages } from "@/utils/getMessages";
import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { getChannelById } from "@/utils/getChannels";
import get_me_fromClient from "@/utils/GET_me";
import React from "react";
import { Input, Tooltip } from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import SelectedChHeader from "@/components/Chat/Channels/SelectedChHeader";
import { getJoinedChannels } from "@/utils/getChannels";
import { CircularProgress, Skeleton, Button } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserType } from "@/types/Channels";
import { DataContext } from "@/components/Play/context";

let socket: any;

export default function Dm({ params }) {

  const {globalSocket} = useContext(DataContext);


  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [channel, setChannel] = useState([]);
  const id = params.id;
  const [me, setMe] = useState<UserType>();
  const [isAdmin, setIsAdmin] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const [allowFetch, setAllowFetch] = useState(false);
  const [channels, setChannels] = useState([]);

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);
  useEffect(() => {
    if (!me || allowFetch === false) return;
    try {
      getChannelById(id).then((response: any[]) => {
        setChannel(response);
        const users = response.slice(1);
        const user = users.find((user) => user.username === me.username);
        if (user && (user.role === "admin" || user.role === "owner")) {
          setIsAdmin(true);
        }
      });
    } catch (error) {
      toast.error("Cannot get channel!",
      {
          toastId: 'error1'
      })
    }
  }, [id, me, allowFetch, trigger]);
  useEffect(() => {
    const fetchMe = get_me_fromClient();
    fetchMe.then(setMe).catch(() => {
      toast.error("Cannot fetch user!",
      {
          toastId: 'error1'
      })
    });
  }, []);

  const channelTrigger = () => {
    setTrigger((prev) => !prev);
  };
  const updateChannelTrigger = () => {
    setTrigger((prev) => !prev);
  };
  const channelPPToast = () => {
  };
  const channelPrToast = () => {
  };
  const isCriticalEvent = () => {
  };
  const DisableCritical = () => {
  };

  useEffect(() => {
    getJoinedChannels().then((data) => {
      const doesExist = data.some(
        (channel) => channel.channel.id === Number(params.id)
      );
      setChannels(data);

      if (doesExist) {
        setAllowFetch(true);
        // //console.log("allow fetch");
      }
    });
  }, [trigger, allowFetch, params.id]);

  const fetchMessages = useCallback(async () => {
    try {
      if (allowFetch === true) {
        const old = await getChMessages(id);
        setMessages(old.messageChannel);
        //console.log("messages: ", old);
      }
    } catch (error) {
      toast.error("Cannot fetch messages!",
      {
          toastId: 'error1'
      })
    }
  }, [id, allowFetch]);

  useEffect(() => {
    fetchMessages();
    if (globalSocket === null) return;
    globalSocket.on("onMessage", fetchMessages);
    const joinmesg = {
      channelId: id,
    };

    globalSocket.emit("join", joinmesg);

    globalSocket.on("createchannel", channelTrigger);
    globalSocket.on("updateChannel", updateChannelTrigger);
    globalSocket.on("join_protected", channelPPToast);
    globalSocket.on("joinprivate_public", channelPrToast);

    globalSocket.on("mute_event", isCriticalEvent);
    globalSocket.on("kicked", isCriticalEvent);
    globalSocket.on("ban_event", isCriticalEvent);

    globalSocket.on("unmute_event", DisableCritical);
    globalSocket.on("unban_event", DisableCritical);

    globalSocket.on("onMessage", fetchMessages);
    globalSocket.on("connect", fetchMessages);


  }, [fetchMessages, id, globalSocket]);

  const handleSendMessage = useCallback(async () => {
    if (userInput.length > 299) {
      toast.info("Message too long",
      {
          toastId: 'info1'
      })
      return;
    }
    try {
      const message = {
        channelId: id,
        message: userInput,
      };
      if (globalSocket) {
        globalSocket.emit("message", message);
        await fetchMessages();
        setUserInput("");
      } else {
        throw new Error("Socket is undefined");
      }
    } catch (error) {
      toast.error("Cannot fetch messages!",
      {
          toastId: 'error1'
      })
    }
    await fetchMessages();
  }, [id, userInput, fetchMessages, globalSocket]);

  useEffect(() => {}, [trigger]);

  return (
    <main className="h-full md:px-10">
      <div className="" key="2">
        <div className="" key="1">
          <div className="w-full p-2">
            {channel && channel[0] ? (
              <SelectedChHeader
                avatarURL={channel[0].Avatar_URL}
                chname={channel[0].title}
                channelId={params.id}
              />
            ) : (
              <div className="md:max-w-[300px] w-full flex items-center gap-3">
                <div>
                  <Skeleton className="flex rounded-full w-12 h-12" />
                </div>
                <div className="w-full flex flex-col gap-2">
                  <Skeleton className="h-3 w-3/5 rounded-lg" />
                  <Skeleton className="h-3 w-4/5 rounded-lg" />
                </div>
              </div>
            )}{" "}
            <div className="flex flex-col flex-grow w-full  bg-midnight border border-midnight-border my-1 shadow-xl rounded-lg overflow-hidden">
              <div className="flex flex-col flex-grow h-[50vh] md:h-[80vh] p-4 overflow-auto">
                {messages &&
                  messages
                    .sort(
                      (a, b) =>
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime()
                    )
                    .map((message, index) => {
                      let date = new Date(message.createdAt);
                      let options = {
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      } satisfies Intl.DateTimeFormatOptions;
                      let formattedDate = date.toLocaleDateString(
                        "en-US",
                        options
                      );

                      if (message.users.username === me.username) {
                        return (
                          <div
                            key={message.id}
                            className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end"
                          >
                            <Tooltip
                              label={formattedDate}
                              placement="left"
                              hasArrow
                            >
                              <div className="flex gap-2 items-start">
                                <div className="bg-midnight border border-midnight-border  p-4 rounded-lg shadow-lg">
                                  <div className="text-xs font-semibold text-midnight-light ">
                                    you
                                  </div>
                                  <p className="text-sm text-midnight-secondary">
                                    {message.message}
                                  </p>
                                </div>
                              </div>
                            </Tooltip>
                          </div>
                        );
                      } else {
                        return (
                          <div
                            key={message.id}
                            className="flex w-full mt-2 space-x-3 max-w-xs"
                          >
                            <Tooltip
                              label={formattedDate}
                              placement="right"
                              hasArrow
                            >
                              <div className="flex gap-2 items-start">
                                <Avatar
                                  name={message.users.username}
                                  src={message.users.Avatar_URL}
                                />
                                <div className="bg-midnight border border-midnight-border  p-4 rounded-lg shadow-lg">
                                  <div className="text-xs font-semibold text-midnight-light">
                                    <Link
                                      href={`/users/${message.users.username}`}
                                    >
                                      {message.users.username}
                                    </Link>
                                  </div>
                                  <p className="text-sm text-midnight-secondary">
                                    {message.message}
                                  </p>
                                </div>
                              </div>
                            </Tooltip>
                          </div>
                        );
                      }
                    })}
                <div ref={messagesEndRef} />
              </div>

              <div className="flex flex-row gap-4 midnight border border-midnight-border text-midnight-secondary p-4">
                <Input
                  placeholder="Enter message"
                  value={userInput}
                  onChange={function (e) {
                    setUserInput(e.target.value);
                  }}
                  onKeyDown={function (e) {
                    if (e.key === "Enter") handleSendMessage();
                  }}
                  type="text"
				          className="text-midnight-secondary focus:border-midnight-secondary border-midnight-border bg-midnight"
                />
                <Button
                  endContent={<ArrowForwardIcon />}
                  variant={"bordered"}
                  className="text-midnight-secondary border border-midnight-border hover:bg-midnight-secondary hover:text-midnight-border"
                  onClick={handleSendMessage}
                >
                  Send
                </Button>
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </main>
  );
}
