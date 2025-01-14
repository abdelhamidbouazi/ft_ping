import React, { useEffect, useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link} from "@nextui-org/react";
import { toast } from 'react-toastify';
import { InviteToChannel } from "@/utils/PostChannel";
import { RiPingPongFill } from "react-icons/ri";

import {Autocomplete, AutocompleteItem, Avatar} from "@nextui-org/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import useSWR from "swr";
import { getAllUsers } from "@/utils/getUsers";
import { UserType } from "@/types/Channels";
import { useRouter } from "next/navigation";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import Swal from 'sweetalert2';
import get_me_fromClient from "@/utils/GET_me";


const users = [];

export default function InviteUserToGame({socket}) {
  const router = useRouter();
  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const [userToInvite, setUserToInvite] = useState('');
  const {
    isLoading: isLoadingAllUsers,
    error: errorAllUsers,
    data: allUsers,
    mutate: mutateAllUsers
  } = useSWR('/users', getAllUsers);
  const {
    isLoading: isLoadingUsersMe,
    error: errorUsersMe,
    data: usersMe,
    mutate: mutateUsersMe
} = useSWR('/users/me', get_me_fromClient);

  const handleUserToInviteChange = (e) => setUserToInvite(e.target.value);

  const handleSubmit = async () => {
    // //console.log(channelId.channelId);
    if (userToInvite == null) {
      toast.error('Please add username first',
      {
          toastId: 'error1'
      })
      return;
    }
    try {
      // const data = await InviteToChannel(channelId, userToInvite);
      toast.success(`User ${userToInvite} invited to this channel`,
      {
          toastId: 'success1'
      })
      // isInvited()
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message,
      {
          toastId: 'error1'
      })
    }
  };



  useEffect(() => {

    if (!socket) return;
    // Listen for real-time invitation event
    const sendInvitation = (me:string) => {
    // //console.log('11111111111invite sent=========');
        Swal.fire({
            title: `${me} invites you to play Pong!`,
            showCancelButton: true,
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#dc3545',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            position: 'bottom-end',
            timer: 10000,
            timerProgressBar: true,
        }).then((result) => {
            if (result.isConfirmed) {
                socket.emit('AcceptedInvi', me);
                // //console.log('Your friend accepted the invitation.');
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                socket.emit('RefuseInvi', me);
                // //console.log('Your friend declined the invitation or closed the dialog.');
            }
        });
    };
    
    socket.on('messageInvi', ( me:string ) => {
        // //console.log('messageInvi=========')
        sendInvitation(me);
    });

    // Other event listeners for handling errors
    socket.on('notFound', (name:string) => {
        toast.error(`The user ${name} not found`,
        {
            toastId: 'error1'
        })
    });

    socket.on('InvitationExpired', (name:string) => {
        toast.error(`The invitation from ${name} is expired`,
        {
            toastId: 'error1'
        })
    });

    socket.on('RefuseInvi', (name:string) => {
        toast.error(`The user ${name} refused your invitation to play`,
        {
            toastId: 'error1'
        })
    });
    
    socket.on('OnGame', (name:string) => {
        toast.error(`The user ${name} is already on game`,
        {
            toastId: 'error1'
        })
    });


return () => {
    socket.off('messageInvi');
    socket.off('notFound');
    socket.off('InvitationExpired');
    socket.off('RefuseInvi');
    socket.off('OnGame');
};
}, [socket]);




  
  const handleSendInvite = async (username: string) => {
    socket.emit('Invite', { username1: '', username2: username });
    // //console.log('invite sent=========');
    onClose();
  }

  return (
    <>
          <Button
          onPress={onOpen}
    startContent={<Icon icon="solar:gamepad-bold-duotone" width={24} />}
    className="bg-midnight border border-midnight-border text-midnight-secondary py-2 px-4 rounded-2xl hover:bg-midnight-light hover:text-zinc-100"
  >
  Invite member to POOONG
  </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 p-4">Search for a user</ModalHeader>
              <ModalBody>
              <Autocomplete
              allowsEmptyCollection={false}
              menuTrigger={'manual'}
      classNames={{
        base: "max-w-full",
        listboxWrapper: "max-h-[320px]",
        selectorButton: "text-default-500"
      }}
      defaultItems={allUsers}
      disabledKeys={["abouazi"]}
      inputProps={{
        classNames: {
          input: "ml-1",
          inputWrapper: "h-[48px]",
        },
      }}
      listboxProps={{
        hideSelectedIcon: true,
        itemClasses: {
          base: [
            "rounded-medium",
            "text-default-500",
            "transition-opacity",
            "data-[hover=true]:text-foreground",
            "dark:data-[hover=true]:bg-default-50",
            "data-[pressed=true]:opacity-70",
            "data-[hover=true]:bg-default-200",
            "data-[selectable=true]:focus:bg-default-100",
            "data-[focus-visible=true]:ring-default-500",
          ],
        },
      }}
      aria-label="Select a user"
      placeholder="Enter a username"
      popoverProps={{
        offset: 10,
        classNames: {
          base: "rounded-large",
          content: "p-1 border-small border-default-100 bg-background",
        },
      }}
      radius="full"
      variant="bordered"
    >
      {(item: UserType) => (
        <AutocompleteItem key={item.id} textValue={item.username} >
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <Avatar alt={item.displayName} className="flex-shrink-0" size="sm" src={item.Avatar_URL} />
              <div className="flex flex-col">
                <span className="text-small">{item.displayName}</span>
                <span className="text-tiny text-default-400">{item.username}</span>
              </div>
            </div>
            <Button
              className="border-small mr-0.5 font-medium shadow-small"
              radius="full"
              size="sm"
              variant="bordered"
              onClick={() => {
                handleSendInvite(item.username);
                // router.push(`/chat/direct/${item.username}`);
                
              }}
            >
              invite to Pong
            </Button>
          </div>
        </AutocompleteItem>
      )}
    </Autocomplete>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  close
                </Button>
                {/* <Button color="primary" onPress={handleSubmit}>
                  Invite
                </Button> */}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
