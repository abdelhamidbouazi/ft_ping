"use client";
import React, { useEffect, useState } from "react";
import {
  useDisclosure,
  Button,
  Stack,
  Input,
  Select,
  FormLabel,
  FormControl,
  Popover,
  PopoverTrigger,
  IconButton,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  ButtonGroup,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import PasswordInput from "../../Inputs/PasswordInput";
import { updatePassword, updateTitle, updateType } from "@/utils/PostChannel";
import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import FocusLock from "react-focus-lock";
import { getChannelById } from "@/utils/getChannels";



const Form = ({ onCancel, currentTitle, currentType, changes, channelId }) => {
  const [title, setTitle] = useState(currentTitle);
  const [channelType, setChannelType] = useState(currentType);
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };
  const handleTypeChange = (event) => {
    let selectedType = event.target.value;
    if (!selectedType) {
      setChannelType(currentType);
    }
    else
        setChannelType(selectedType);
  };
  const handlePasswordChange = (event) => {
    // //console.log(event.target.value);
    setPassword(event.target.value);
};

const handleSave = async () => {
    setIsLoading(true);
    if (title !== currentTitle)
    {
        try {
            const data = await updateTitle(channelId, title);
            toast.success(`-HAAAAAA9_MCHAA-\n You changed channel title successfully to ${title}`,
            {
                toastId: 'success1'
            })
            changes();
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message,
            {
                toastId: 'error1'
            })
        }
    }
    if (channelType !== currentType){
        if (channelType === 'protected' && password === "") {
            toast.error('You have to set password',
            {
                toastId: 'error1'
            })
            setIsLoading(false);
            return;
          }
          try {
            const data = await updateType(channelId, channelType, password);
            toast.success(`-HAAAAAA9_MCHAA-\n You changed channel type successfully to ${channelType}`,
            {
                toastId: 'success1'
            })
            changes();
          } catch (error) {
            toast.error(error?.response?.data?.message || error.message,
            {
                toastId: 'error1'
            })
          }
        }
        if (password !== "" && currentType === 'protected') {
          try {
            const data = await updatePassword(channelId, password);
            toast.success(`-HAAAAAA9_MCHAA_HACKER-\n You changed channel password successfully`,
            {
                toastId: 'success1'
            })
            changes();
            setIsLoading(false);
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message,
            {
                toastId: 'error1'
            })
        }
    }
    if (password === "" && channelType === currentType && title === currentTitle) {
        toast.error('-SEM7AMMED- No changes to save',
        {
            toastId: 'error1'
        })
        setIsLoading(false)
        return;
    }
    setIsLoading(false);
    onCancel();
}

  return (
    <Stack spacing={4}>
      <FormControl>
        <FormLabel>Channel title</FormLabel>
        <Input
          id="title"
          placeholder="Change channel title"
          onChange={handleTitleChange}
          defaultValue={currentTitle}
        />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>Channel Type</FormLabel>
        <Select id="type" onChange={handleTypeChange} defaultChecked={currentType} defaultValue={currentType}>
          <option value="public">public</option>
          <option value="private">private</option>
          <option value="protected">protected</option>
        </Select>
      </FormControl>
      {channelType === "protected" && (
        <FormControl mt={4}>
          <FormLabel>Password</FormLabel>
          <PasswordInput onChange={handlePasswordChange} />
        </FormControl>
      )}
      <ButtonGroup display="flex" justifyContent="flex-end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button colorScheme="teal" onClick={handleSave} isLoading={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </ButtonGroup>
    </Stack>
  );
};
export default function ManageChannel({ channelId }) {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [channel, setChannel] = useState(null);
  const [trigger, setTrigger] = useState(false);
  const firstFieldRef = React.useRef(null);

  useEffect(()=> {
    const getChannel = async () => {
        await getChannelById(channelId).then(data => {
            setChannel(data[0]);
        });
    }
    getChannel();
  }, [trigger, channelId])

  return (
    <>
      <Popover
        isOpen={isOpen}
        initialFocusRef={firstFieldRef}
        onOpen={onOpen}
        onClose={onClose}
        placement="bottom"
        closeOnBlur={false}
      >
        <PopoverTrigger>
          <IconButton aria-label="" size="sm" icon={<EditIcon />} />
        </PopoverTrigger>
        <PopoverContent p={5}>
          <FocusLock returnFocus persistentFocus={false}>
            <PopoverArrow />
            <PopoverCloseButton />
            {(channel !== null && channel.title && channel.type) && (
                <Form onCancel={onClose} currentTitle={channel.title} currentType={channel.type} changes={()=>{setTrigger(prev => !prev)}} channelId={channelId} />
            )}
          </FocusLock>
        </PopoverContent>
      </Popover>
    </>
  );
}