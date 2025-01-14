import React, { useEffect, useState } from 'react';
import {
  Autocomplete,
  AutocompleteSection,
  AutocompleteItem,
  Avatar,
} from "@nextui-org/react";
import { getChannels } from '@/utils/getChannels';

const SearchChannels = ({ onChannelSelect }) => {
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    getChannels().then(data => {
      setChannels(data);
    });
  }, []);

  const handleSelect = (channel) => {
    onChannelSelect(channel);
  };

  return (
    <Autocomplete
      label="Search for a channel"
      className="max-w-full"
      isRequired
      onSelect={handleSelect}
    >
      {channels.map((channel) => (
        <AutocompleteItem
          key={channel.id}
          startContent={<Avatar alt={channel.title} className="w-6 h-6" src={channel.Avatar_URL} />}
        >
          {channel.title}
        </AutocompleteItem>
      ))}
    </Autocomplete>
  );
};

export default SearchChannels;
