import React from "react";
import { useEffect, useState } from "react";
import { Avatar, ScrollShadow } from "@nextui-org/react";
import Link from "next/link";
import { toast } from "react-toastify";
import { DataType } from "@/types/Channels";

export default function ChannelsList({channels, onChannelSelect, isSelected, setAllowLeave}) {

  const [selectedChannelInside] = useState('');

  useEffect(() => {
    if (selectedChannelInside  === undefined) {
      toast.info('Please select a channel first',
      {
          toastId: 'info1'
      })
      return;
    }

}, [selectedChannelInside, isSelected, onChannelSelect]);

  const handleSelection = (channelId: any) => {
    // //console.log("channelId : ", channelId);
    onChannelSelect(channelId);
    setAllowLeave(true);
  }

  return (
  <>
  {channels ? (
      <ScrollShadow hideScrollBar size={10} className="w-full h-[200px]">
      <div className="p-2 pb-10">
      {channels.map((item: any, index: number) => (
          <div key={index} className="p-2 " onClick={()=> {
            handleSelection((item as DataType).channel.id)
          }}>
              <Link href={`/chat/channel/${(item as DataType).channel.id}`}>
                <div className="flex gap-2 items-center border border-midnight-border rounded-lg h-14 px-4">
                  <Avatar alt={(item as DataType).channel.title} className="flex-shrink-0" size="sm" src={(item as DataType).channel.Avatar_URL} />
                  <div className="flex flex-col">
                    <span className="text-small text-midnight-secondary pl-2">{(item as DataType).channel.title}</span>
                  </div>
                </div>
              </Link>
          </div>
        ))}
      </div>
    </ScrollShadow>
) : <>
  <div className="flex justify-center items-center">
    <span className="text-midnight-secondary">No channels found</span>
  </div>
  </>
}
  </>
  );
}
