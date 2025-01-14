import React, { useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input} from "@nextui-org/react";
import { toast } from 'react-toastify';
import { InviteToChannel } from "@/utils/PostChannel";

export default function InviteUser({channelId, isInvited}) {
  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const [userToInvite, setUserToInvite] = useState('');

  const handleUserToInviteChange = (e) => setUserToInvite(e.target.value);

  const handleSubmit = async () => {
    if (userToInvite == null) {
      toast.error('Please Set a User',
      {
          toastId: 'error1'
      })
      return;
    }
    try {
      const data = await InviteToChannel(channelId, userToInvite);
      toast.success(`User ${userToInvite} invited to this channel`,
      {
          toastId: 'success1'
      })
      isInvited()
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
      <Button size={"sm"} onPress={onOpen} color="primary" className="bg-gray-200 text-gray-800">Invite User</Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Invite User to channel</ModalHeader>
              <ModalBody>
                <Input
                  type="text"
                  label="User"
                  value={userToInvite}
                  onChange={handleUserToInviteChange}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleSubmit}>
                  Invite
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
