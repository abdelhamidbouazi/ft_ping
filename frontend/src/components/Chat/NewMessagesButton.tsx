import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { Autocomplete, AutocompleteItem, Avatar } from "@nextui-org/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { getAllUsers } from "@/utils/getUsers";
import { UserType } from "@/types/Channels";
import { useRouter } from "next/navigation";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import useSWR from "swr";

export default function NewMessagesButton() {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [userToInvite, setUserToInvite] = useState("");
  const {
    isLoading: isLoadingAllUsers,
    error: errorAllUsers,
    data: allUsers,
    mutate: mutateAllUsers,
  } = useSWR("/users", getAllUsers);

  const handleUserToInviteChange = (e) => setUserToInvite(e.target.value);

  const handleSubmit = async () => {
    if (userToInvite == null) {
      toast.error("Please add username first",
      {
          toastId: 'error1'
      })
      return;
    }
    try {
      toast.success(`User ${userToInvite} invited to this channel`,
      {
          toastId: 'success1'
      })
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message,
      {
          toastId: 'error1'
      })
    }
  };

  return (
    <>
      <Button
        onPress={onOpen}
        startContent={<IoChatbubbleEllipsesOutline />}
        className="bg-midnight border border-midnight-border text-midnight-secondary font-bold py-2 px-4 rounded-2xl hover:bg-midnight-light hover:text-zinc-100"
      >
        New Message
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 p-4">
                Search for a user
              </ModalHeader>
              <ModalBody>
                <Autocomplete
                  allowsEmptyCollection={false}
                  menuTrigger={"manual"}
                  classNames={{
                    base: "max-w-full",
                    listboxWrapper: "max-h-[320px]",
                    selectorButton: "text-default-500",
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
                      content:
                        "p-1 border-small border-default-100 bg-background",
                    },
                  }}
                  radius="full"
                  variant="bordered"
                >
                  {(item: UserType) => (
                    <AutocompleteItem key={item.id} textValue={item.username}>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2 items-center">
                          <Avatar
                            alt={item.displayName}
                            className="flex-shrink-0"
                            size="sm"
                            src={item.Avatar_URL}
                          />
                          <div className="flex flex-col">
                            <span className="text-small">
                              {item.displayName}
                            </span>
                            <span className="text-tiny text-default-400">
                              {item.username}
                            </span>
                          </div>
                        </div>
                        <Button
                          className="border-small mr-0.5 font-medium shadow-small"
                          radius="full"
                          size="sm"
                          variant="bordered"
                          onClick={() => {
                            router.push(`/chat/direct/${item.username}`);
                            onClose();
                          }}
                        >
                          Direct message
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
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
