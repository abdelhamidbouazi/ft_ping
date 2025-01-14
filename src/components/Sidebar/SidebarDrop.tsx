'use client';

import { Listbox, ListboxItem } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { MdSpaceDashboard, MdMarkChatUnread } from "react-icons/md";
import { GiPingPongBat } from "react-icons/gi";
import { Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay } from '@chakra-ui/react';





function SidebarDrop({ isOpen, onClose, onOpen }) {
  const router = useRouter();
  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0 text-gray-700";

  return (
    
<>
<Drawer placement={'left'} onClose={onClose} isOpen={isOpen}>
  <DrawerOverlay />
  <DrawerContent >
    <DrawerHeader borderBottomWidth='1px'>Navigation</DrawerHeader>
    <DrawerBody >
    <div className="w-full max-w-full px-1 py-2 rounded-small text-gray-700">
    <Listbox variant="solid" aria-label="Navbar Listbox">
      <ListboxItem
      className='h-14'
        onClick={() => router.push('/dashboard')}
        key="home"
        startContent={<MdSpaceDashboard className={iconClasses} />}
      >
        Dashboard
      </ListboxItem>
      <ListboxItem
      className='h-14'
        onClick={() => router.push('/game')}
        key="game"
        startContent={<GiPingPongBat className={iconClasses} />}
      >
        PING PONG
      </ListboxItem>
      <ListboxItem
      className='h-14'
        onClick={() => router.push('/chat')}
        key="chat"
        startContent={<MdMarkChatUnread className={iconClasses} />}
      >
        Chat & Rooms
      </ListboxItem>
    </Listbox>
  </div>
    </DrawerBody>
  </DrawerContent>
</Drawer>
</>
  );
}

export default SidebarDrop;