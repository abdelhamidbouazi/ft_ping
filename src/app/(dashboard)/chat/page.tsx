'use client'
import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import ChatIconContainer from '../../../../public/ChatIconContainer.svg'
import NewMessagesButton from '@/components/Chat/NewMessagesButton'


export default function Page() {
  const router = useRouter()

  return (
    <>
      <section className='px-4 md:px-10'>
        <div className='flex flex-col gap-5 items-center justify-center w-full midnight my-1 shadow-xl rounded-lg overflow-hidden h-[50vh] md:h-[90vh] border border-midnight-border'>
          <Image src={ChatIconContainer} alt='chatIcon' priority/>
          <span className='text-lg font-semibold text-center text-midnight-secondary'>Messages</span>
          <span className='text-base font-normal text-center text-midnight-light'>Click on a contact or a channel to view messages.</span>
          <NewMessagesButton />

        </div>
      </section>
    </>
  )
}