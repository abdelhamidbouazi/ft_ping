"use client";
import axios from "@/app/api/axios";
import { HStack, PinInput, PinInputField } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

import { useState } from "react";
// import { ToastContainer, toast } from "react-toastify";
import { useToast } from '@chakra-ui/react'

export default function Twofa() {
  const toast = useToast();

  const router = useRouter();
  const [invalid, setInvalid] = useState(false);

  const formHandler = async (e: string) => {
    if (e.length === 6) {
        if(e.length !== 6) return setInvalid(false)
        const res = await axios.post(
          "/auth/2fa_auth",
          {
            two_fa_code: e,
          },
          {
            withCredentials: true,
          }
        ).then((res) => {
            toast({
                title: `Done`,
                status: 'success',
                isClosable: true,
              })
            router.push('/dashboard');
        }) .catch((err) => {
          setInvalid(true);
        });

    }
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen w-screen">
        <div className="flex flex-col items-center bg-midnight justify-center max-w-lg p-6 border border-midnight-border rounded-lg shadow dark:midnight dark:border-gray-700">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-midnight-secondary">
            POOONG Two-Factor Authentication
          </h5>
          <p className="text-midnight-secondary text-large">ENTER PONG AUTH CODE</p>
          {invalid && <p className="text-red-500 text-sm">Invalid code</p>}
          <HStack>
            <PinInput otp onChange={formHandler}  isInvalid={invalid} focusBorderColor='Purple 900' colorScheme="purple">
              <PinInputField key='1' />
              <PinInputField key='2'/>
              <PinInputField key='3'/>
              <PinInputField key='4'/>
              <PinInputField key='5'/>
              <PinInputField key='6'/>
            </PinInput>
          </HStack>
        </div>
      </div>
    </>
  );
}
