"use client";
import React, { useEffect, useState } from "react";
import {
  Avatar,
  AvatarBadge,
  Button,
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  ModalFooter,
  Box,
} from "@chakra-ui/react";
import { Card, Dropdown } from "flowbite-react";
import ManageChannel from "./Settings/ManageChannel";
import { getChannelById } from "@/utils/getChannels";
import { toast } from "react-toastify";
import get_me_fromClient from "@/utils/GET_me";
import ImageInput from "../Inputs/ImageInput";
import { Tooltip } from "@nextui-org/react";

interface SelectedChHeaderProps {
  avatarURL: string;
  chname: string;
  channelId: string;
}
interface User {
  username: string;
  role: string;
}

const SelectedChHeader: React.FC<SelectedChHeaderProps> = ({
  avatarURL,
  chname,
  channelId,
}) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [channel, setChannel] = useState<User[]>([]);
  const [me, setMe] = useState<User | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  useEffect(() => {
    if (!me || !channelId) return;
    getChannelById(channelId)
      .then((response) => {
        setChannel(response[0]);
        const users = response.slice(1);
        const user = users.find((user) => user.username === me.username);
        if (user && (user.role === "admin" || user.role === "owner")) {
          setIsAdmin(true);
        }
      })
      .catch((error) => {
        toast.error("Cannot fetch channel!",
        {
            toastId: 'error1'
        })
      });
  }, [channelId, me]);
  useEffect(() => {
    const fetchMe = get_me_fromClient();
    fetchMe.then(setMe).catch(() => {
      toast.error("Cannot fetch user!",
      {
          toastId: 'error1'
      })
    });
  }, []);

  return (
    <div className="flex flex-row justify-between items-center bg-midnight border border-midnight-border  py-4 px-6 rounded-lg">
      <div className="flex flex-row items-center">
        <div className="rounded-full">
          {channel && isAdmin && (
            <div>
              <Tooltip
                showArrow
                placement="right"
                content="Click to change channel image"
                classNames={{
                  base: [
                    "before:bg-neutral-400 dark:before:bg-white",
                  ],
                  content: [
                    "py-2 px-4 shadow-xl",
                    "text-slate-800 bg-gradient-to-br from-white to-slate-300",
                  ],
                }}
              >
                <button onClick={onOpen}>
                  <Avatar name={chname} src={avatarURL} />
                </button>
              </Tooltip>
              <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Change channel image</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody pb={6}>
                    <FormControl>
                      <ImageInput channelId={channelId} close={onClose} />
                    </FormControl>
                  </ModalBody>
                  <ModalFooter></ModalFooter>
                </ModalContent>
              </Modal>
            </div>
          )}
          {channel && !isAdmin && <Avatar name={chname} src={avatarURL} />}
        </div>
        <div className="flex flex-col items-start px-6">
          <div className="text-sm font-semibold text-midnight-secondary">{chname}</div>
        </div>
      </div>
      <div>{isAdmin && <ManageChannel channelId={channelId} />}</div>
    </div>
  );
};

export default SelectedChHeader;
