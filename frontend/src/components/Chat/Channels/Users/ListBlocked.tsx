import React, { useContext } from "react";
import {
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  User,
} from "@nextui-org/react";
import { VerticalDotsIcon } from "./VerticalDotsIcon";
import { useEffect } from "react";
import { DataContext } from "@/components/Play/context";

export default function ListBlocked({channelId, blockedUsers, isLoadingBlockedUsers, mutateBlockedUsers, errorBlockedUsers, handleUnban}) {

  const {globalSocket} = useContext(DataContext);

  useEffect(() => {
    if (globalSocket === null) return;
    globalSocket.on("ban_event", mutateBlockedUsers);
    globalSocket.on("unban_event", mutateBlockedUsers);
    return () => {
      globalSocket.off("ban_event");
      globalSocket.off("unban_event");
    };
    // //console.log("blockedUsers", blockedUsers);

  }, [globalSocket]);


  return (
    <>
    {isLoadingBlockedUsers && <div className="text-center text-midnight-secondary">Loading...</div>}
        {(blockedUsers !== undefined && Array.isArray(blockedUsers) &&  blockedUsers.length > 0 && !isLoadingBlockedUsers) && blockedUsers.map((user, index) => (
      <div key={index} className="p-2 text-slate-200">
          <div className="flex flex-row justify-between w-full" key={user.users.id}>
            <div>
              <User
                description={user.users.username}
                name={user.users.nickname}
                avatarProps={{ src: user.users.Avatar_URL }}
              >
                {user.users.nickname}
              </User>
            </div>
            <div>
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <VerticalDotsIcon className="text-default-300" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                  <DropdownItem key="unban" color="default" onClick={() => handleUnban(user.users.id)}>
                    Unban
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </div>
        )
        )}
    </>
  );
}