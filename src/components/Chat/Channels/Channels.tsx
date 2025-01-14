import React, { useEffect, useState } from 'react';
import {getJoinedChannels} from '../../../utils/getChannels';
import {Avatar} from '@chakra-ui/react'

const Channels = () => {
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);

  useEffect(() => {
    getJoinedChannels().then(data => {
      setChannels(data);
    });
  }, []);

  const handleChannelClick = (channelId) => {
    setSelectedChannel(channelId);
  }

  return (
    <div className=' overflow-auto midnight border border-gray-600 rounded-md px-6 py-4 h-full'>
      {channels.map(channel => (
        <button
          key={channel.channel.id}
          className={`flex flex-row items-center rounded-xl p-2 w-full mt-2 border border-gray-700 ${channel.id === selectedChannel ? 'bg-gray-700' : 'midnight hover:bg-gray-700'}`}
          onClick={() => handleChannelClick(channel.channel.id)}
        >
            <Avatar name={channel.channel.title} src='' />
          <div className="ml-2 text-sm font-semibold">{channel.channel.title}</div>
        </button>
      ))}
    </div>
  );
};

export default Channels;
