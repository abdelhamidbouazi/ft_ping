import React from "react";
import {
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  User,
} from "@nextui-org/react";
import { VerticalDotsIcon } from "../Users/VerticalDotsIcon";
import { toast } from 'react-toastify';
import { AcceptInvite, DeclineInvite } from "@/utils/PostChannel";


export default function ListChannelInvites({mutateChannelInvites, invites}) {

  const handleAccept = async (id: string) => {
    try {
      const data = await AcceptInvite(id);
      toast.success(`-HANA_LIKOM- You accepted channel invite successfully`,
      {
          toastId: 'success1'
      })
      mutateChannelInvites();
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message,
      {
          toastId: 'error1'
      })
    }
  };
  const handleDecline = async (id: string) => {
    try {
      const data = await DeclineInvite(id);
      toast.success(`-LAAAAA2EEE7_MABGHITCH- You declined channel invite successfully`,
      {
          toastId: 'success1'
      })
      mutateChannelInvites();
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message,
      {
          toastId: 'error1'
      })
    }
  };


  return (
    <>
      <div className="p-2">
        {invites !== undefined && Array.isArray(invites) && invites.map((invite) => (
          <div className="flex flex-row justify-between w-full" key={invite.id}>
            <div >
              <User
                description={invite.channel.type}
                name={invite.channel.title}
                avatarProps={{ src: invite.channel.Avatar_URL }}
                className="text-slate-200"
              >
                {invite.channel.title}
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
                  <DropdownItem key="accept" color="default" onClick={() => handleAccept(invite.channel.id)}>
                    Accept
                  </DropdownItem>
                  <DropdownItem key="decline" color="default" onClick={() => handleDecline(invite.channel.id)}>
                    Decline
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}