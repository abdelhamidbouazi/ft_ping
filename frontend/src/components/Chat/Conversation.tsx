import React from "react";
import { Input, Tooltip } from "@chakra-ui/react";
import { Button } from "@nextui-org/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import SelectedUserHeader from "./SelectedUserHeader";
import { useRef, useEffect } from "react";

const Converstation = ({
  params,
  messages,
  userInput,
  setUserInput,
  handleClick,
  Avatar,
  name,
  username,
}) => {
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  type OptionsTypes = {
    timeZone: string
    month: string;
    day: string;
    hour: string;
    minute: string;
  };

  return (
    <div className="" key="2">
      <div className="md:w-4/4 w-full" key="1">
        <div className="">
          <SelectedUserHeader
            avatarURL={Avatar}
            username={username}
            fullName={name}
          />
          <div className="flex flex-col flex-grow w-full bg-midnight border border-midnight-border shadow-xl rounded-lg overflow-hidden">
            <div className="flex flex-col flex-grow h-[50vh] md:h-[80vh] p-4 overflow-auto">
              {messages !== undefined && Array.isArray(messages) ? (
                messages
                .map((message, index) => {
                  const user = message[0];
                  const userMessages = message[1];

                  return (
                    <React.Fragment key={index}>
                      {userMessages &&
                        userMessages
                        .sort(
                          (a, b) =>
                            new Date(a.createdAttime).getTime() -
                            new Date(b.createdAttime).getTime()
                        )
                        .map((msg, i) => {
                          let date = new Date(msg.createdAttime);
                          let options = {
                            timeZone: "Africa/Casablanca",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          } as OptionsTypes;
                          let formattedDate = date.toLocaleDateString(
                            "en-US",
                            {
                              timeZone: "Africa/Casablanca",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          );
                          if (username && username !== msg.sender) {
                            return (
                              <div
                                key={msg.id}
                                className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end"
                              >
                                <Tooltip
                                  label={formattedDate}
                                  placement="left"
                                  hasArrow
                                >
                                  <div>
                                    <div className="bg-midnight border border-midnight-border text-midnight-secondary p-3 rounded-l-lg rounded-br-lg">
                                      <p key={msg.id} className="text-sm">
                                        {msg.text}
                                      </p>
                                    </div>
                                  </div>
                                </Tooltip>
                              </div>
                            );
                          } else if (username && username === msg.sender) {
                            return (
                              <div
                                key={msg.id}
                                className="flex w-full mt-2 space-x-3 max-w-xs"
                              >
                                <Tooltip
                                  label={formattedDate}
                                  placement="right"
                                  hasArrow
                                >
                                  <div>
                                    <div className="bg-midnight border border-midnight-border text-midnight-secondary p-3 rounded-r-lg rounded-bl-lg">
                                      <p key={msg.id} className="text-sm">
                                        {msg.text}
                                      </p>
                                    </div>
                                  </div>
                                </Tooltip>
                              </div>
                            );
                          }
                        })}
                    </React.Fragment>
                  );
                })
              ) : (
                <div>No such messages</div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex flex-row gap-4 border border-midnight-border text-midnight-secondary p-4">
              <Input
                placeholder="Enter a message"
                value={userInput}
                onChange={function (e) {
                  setUserInput(e.target.value);
                }}
                onKeyDown={function (e) {
                  
                  
                  if (e.key === "Enter") {
                    handleClick(); 
                  }
                }}
                type="text"
                className="text-midnight-secondary focus:border-midnight-secondary border-midnight-border bg-midnight"
              />
              <Button
                endContent={<ArrowForwardIcon />}
                variant={"bordered"}
                className="text-midnight-secondary border border-midnight-border hover:bg-midnight-secondary hover:text-midnight-border"
                onClick={handleClick}
              >
                Send
              </Button>
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default Converstation;
