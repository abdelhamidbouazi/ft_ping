"use client";
import { useState, useEffect } from "react";
import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import TwoFactorAuth from '@/components/Cards/2fa/TwoFactorAuth';


const Twofact = () => {
  const OverlayOne = () => (
    <ModalOverlay
      bg="blackAlpha.300"
      backdropFilter="blur(10px) hue-rotate(90deg)"
    />
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = useState(<OverlayOne />);

  return (
    <div className="flex">
          <Button
            onClick={() => {
              setOverlay(<OverlayOne />);
              onOpen();
            }}
          >
            Authenticator App
          </Button>
          <Modal isCentered isOpen={isOpen} onClose={onClose}>

            <ModalContent>
              <ModalHeader>Enable 2FA</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <TwoFactorAuth onClose={onClose}/>
              </ModalBody>
              <ModalFooter>
                <Button onClick={onClose}>Close</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
  );
}

export default Twofact;
