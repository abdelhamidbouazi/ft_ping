import React from "react";
import {
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  User,
} from "@nextui-org/react";
import { VerticalDotsIcon } from "./VerticalDotsIcon";

export default function ListUsers({blockedUsers}) {

  return (
    <>
      <div>
        {blockedUsers !== undefined && Array.isArray(blockedUsers) ? blockedUsers.map((user) => (
          <div className="flex flex-row justify-between w-full" key={user.id}>
            <div>
              <User
                description={user.username}
                name={user.displayName}
                avatarProps={{ src: user.Avatar_URL }}
              >
                {user.nickname}
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
                  <DropdownItem key="profile" color="default">
                    View Profile
                  </DropdownItem>
                  <DropdownItem key="play" color="default">
                    Challenge in pong
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        )) : <div>no users</div>}
      </div>
    </>
  );
}
