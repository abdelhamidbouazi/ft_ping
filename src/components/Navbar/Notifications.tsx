import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  ListboxSection,
  User,
} from "@nextui-org/react";
import React, { useContext, useEffect } from "react";
import Link from "next/link";
import axios from "@/app/api/axios";
import { toast } from "react-toastify";
import useSWR from "swr";
import { getUserInvits } from "@/utils/getUsers";

//game
import { DataContext } from "@/components/Play/context";
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';


export default function Notifications() {

  //game
  const {globalSocket , setInvite , setComponent} = useContext(DataContext);
  const router = useRouter();


  const {
    isLoading: isLoadingUserInvitations,
    error: errorUserInvitations,
    data: userInvitations,
    mutate: mutateUserInvitations
} = useSWR('/friends/FriendsReqs', getUserInvits);

  const acceptHandler = async (username: string) => {
    try {
      await axios.post(`/friends/accept_a_request/${username}`, {
        withCredentials: true,
      });
      mutateUserInvitations();
      toast.success(`You accepted friend request of ${username}`,
      {
          toastId: 'success1'
      })
    } catch (error) {
      console.log("Error declining friend request:", error.message);
    }
  };
  const declineHandler = async (username: string) => {
    try {
      await axios.delete(`/friends/reject/${username}`, {
        withCredentials: true,
      });
      mutateUserInvitations();
      toast.success(`You declined friend request of ${username}`,
      {
          toastId: 'success1'
      })
    } catch (error) {
      console.log("Error declining friend request:", error.message);
    }
  };
  useEffect(() => {
    if(globalSocket === null) return;
    // //console.log(userInvitations);
    globalSocket.on("new_friend_request", () => {
      mutateUserInvitations();
    });
    globalSocket.on("cancel_request", () => {
      mutateUserInvitations();
    });
    globalSocket.on("reject_request", () => {
      mutateUserInvitations();
    });
    globalSocket.on("accept_request", () => {
      mutateUserInvitations();
    });

    //game
              const sendInvitation = (senderName:string) => {
                Swal.fire({
                    title: `${senderName} invites you to play Pong!`,
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
                        globalSocket.emit('AcceptedInvi', senderName);
                        // //console.log('Your friend accepted the invitation.');
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        globalSocket.emit('RefuseInvi', senderName);
                        // //console.log('Your friend declined the invitation or closed the dialog.');
                    }
                });
            };
  

            //game
            globalSocket.on('messageInvi', ( senderName:string ) => {
                sendInvitation(senderName);
            });


          //game
          globalSocket.on('AcceptedInvi', ( senderName:string ) => {
            globalSocket.emit("Mode", "Invite");
            setInvite(true);
            setComponent("startgame");
            router.push(`/game`);
          });

            globalSocket.on('notFound', (name:string) => {
              error(`The user ${name} not found`);
            });

            globalSocket.on('InvitationExpired', (name:string) => {
              error(`The invitation from ${name} is expired`);
            });

            globalSocket.on('RefuseInvi', (name:string) => {
              error(`The user ${name} refused your invitation to play`);
            });

            globalSocket.on('OnGame', (name:string) => {
              error(`The user ${name} is already on game`);
            });

            globalSocket.on('youOnGame', (name:string) => {
              error(`The user ${name}  on game`);
            });

            const error = (message:string) => {
              toast.error(message, {
                  position: 'top-right',
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: 'light',
              });
            };

            // globalSocket.on("alreadyLogged", ()=>{
            //   error("you already logged in other place try again ... ");
            //   setComponent("error");
            //   router.push(`/game`);
            // });

            return () => {
              globalSocket.off('messageInvi');
              globalSocket.off('notFound');
              globalSocket.off('InvitationExpired');
              globalSocket.off('RefuseInvi');
              globalSocket.off('OnGame');
            };

  }, [userInvitations, mutateUserInvitations, globalSocket]);
  return (
    <>
      <Dropdown
        closeOnSelect={false}
        type={"listbox"}
        showArrow
        backdrop="blur"
        classNames={{
          base: "before:bg-midnight",
          content: "py-1 px-1 border border-midnight-border bg-midnight",
        }}
      >
        <DropdownTrigger>
          <Button
            isIconOnly
            className="text-midnight-secondary bg-midnight-light border border-midnight-border"
            aria-label="Like"
          >
            {userInvitations !== undefined && userInvitations.length > 0 ? (
              <Badge
                content={userInvitations.length}
                shape="circle"
                color="danger"
                size={"sm"}
                showOutline={false}
              >
                <Icon icon="solar:bell-bing-bold-duotone" width={24} />
                
              </Badge>
            ) : (
              <Icon icon="solar:bell-bing-bold-duotone" width={24}/>
            )}
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions" selectionMode="none">
          <ListboxSection title="Notifications">
            {userInvitations !== undefined
              ? userInvitations.map((invite, index) => {
                  return (
                    <DropdownItem
                      key={index}
                      textValue={"d"}
                      isReadOnly
                      classNames={{
                        base: "before:bg-midnight bg-midnight hover:bg-midnight-secondary",
                        wrapper: " bg-midnight hover:bg-midnight-secondary",
                        title: "text-midnight-secondary",
                      }}
                    >
                      <div className="flex items-center justify-between space-x-4 w-96">
                        <User
                          name={invite.displayName}
                          description={
                            <Link href={`/user/${invite.username}`}>
                              @{invite.username}
                            </Link>
                          }
                          avatarProps={{
                            src: `${invite.Avatar_URL}`,
                          }}
                        />
                        <div className="inline-flex justify-end text-base font-semibold text-gray-900 dark:text-white gap-x-3">
                          <Button
                            isIconOnly
                            className="text-midnight-secondary border border-midnight-border bg-midnight hover:bg-midnight-secondary hover:text-midnight hover:border-midnight-secondary"
                            aria-label="Like"
                            onClick={() => acceptHandler(invite.username)}
                          >
                            <Icon icon="fluent-mdl2:accept-medium" />
                          </Button>
                          <Button
                            isIconOnly
                            className="text-midnight-secondary border border-midnight-border bg-midnight hover:bg-midnight-secondary hover:text-midnight hover:border-midnight-secondary"
                            aria-label="Like"
                            onClick={() => declineHandler(invite.username)}
                          >
                            <Icon icon="ph:x-bold" />
                          </Button>
                        </div>
                      </div>
                    </DropdownItem>
                  );
                })
              : null}
          </ListboxSection>
        </DropdownMenu>
      </Dropdown>
    </>
  );
}
