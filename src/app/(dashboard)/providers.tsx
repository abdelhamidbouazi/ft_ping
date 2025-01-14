'use client'
import {NextUIProvider} from "@nextui-org/react";
import { ChakraProvider } from '@chakra-ui/react'
import {useRouter} from 'next/navigation'


export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push}>
      <ChakraProvider >{children}</ChakraProvider>
    </NextUIProvider>
  )
}
