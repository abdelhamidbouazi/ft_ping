'use client'
import {
    useDisclosure,
    FormLabel,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
} from '@chakra-ui/react';
import PasswordInput from '../Inputs/PasswordInput';
import {  joinChannel } from '@/utils/PostChannel';
import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState } from 'react';
import {
    Autocomplete,
    AutocompleteItem,
    Avatar,
} from "@nextui-org/react";
import { getChannelById } from '@/utils/getChannels';
import get_me_fromClient from '@/utils/GET_me';
import { Button } from '@nextui-org/react';
import { TiGroup } from "react-icons/ti";
import useSWR from 'swr';

type Mydata = {
    id: number,
    username: string,
    nickname: string,
    achievements: string[],
    ladder_lvl: number,
    status: string,
    Avatar_URL: string
    displayName: string,
  }

export default function JoinChannel({channelsList, isLoadingChannels, mutateJoinedChannels}) {
    // //console.log('channelsList', channelsList)
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [password, setPassword] = useState('');
    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)
    const [selectedChannel, setSelectedChannel] = useState({
        id: null,
        title: '',
        type: '',
        Avatar_URL: '',
        password: '',
        users: [],
        messages: [],
    });
    const [selectedChannelId, setSelectedChannelId] = useState(null);
    const {
        isLoading: isLoadingUsersMe,
        error: errorUsersMe,
        data: usersMe,
        mutate: mutateUsersMe
    } = useSWR('/users/me', get_me_fromClient);

    useEffect(() => {
        if (errorUsersMe)
            toast.error('Cannot fetch user!',
            {
                toastId: 'error1'
            })
    }, [errorUsersMe]);
    

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };


    const handleSelect = async (channel) => {
        await getChannelById(channel).then(data => {
            setSelectedChannel(data[0]);
        });
        setSelectedChannelId(channel);
    };

    useEffect(() => {
        if (isLoadingChannels) return;

    }, [channelsList, isLoadingChannels]);
    let isInvited = true;
    const handleSubmit = async () => {
        if (selectedChannelId == null) {
            toast.error('Please Select a Channel',
                {
                    toastId: 'error1'
                })
            return;
        }
        if (selectedChannel.type === 'protected' && !password) {
            toast.error('Please fill all fields',
                {
                    toastId: 'error1'
                })
            return;
        }
        if (selectedChannel.type === 'private' && !isInvited) {
            toast.error('You are not invited to this channel',
                {
                    toastId: 'error1'
                })
            return;
        }
        try {
            const data = await joinChannel(usersMe.id, selectedChannel.id, password, selectedChannel.type);
            toast.success(`You joined #${selectedChannel.title} Successfully`,
                {
                    toastId: 'success1'
                })
            mutateJoinedChannels();
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
            <div className='w-full'>
                
                <Button className='bg-midnight border border-midnight-border text-midnight-secondary font-normal py-2 px-4 rounded-lg hover:bg-midnight-light hover:text-midnight w-full' aria-label='Join Channel' startContent={<TiGroup />} size='sm' onClick={onOpen} >Join Channel</Button>
                <Modal
                    initialFocusRef={initialRef}
                    finalFocusRef={finalRef}
                    isOpen={isOpen}
                    onClose={onClose}
                >
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Join Channel</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            {!isLoadingChannels && 
                                <FormControl >
                                    <FormLabel>Channel Type</FormLabel>
                                    <Autocomplete
                                        label="Search for a channel"
                                        className="max-w-full"
                                        isRequired
                                        onSelectionChange={handleSelect}
                                    >
                                        {channelsList ? (
                                            channelsList.map((channel) => (
                                                <AutocompleteItem
                                                    key={channel.id}
                                                    startContent={<Avatar alt={channel.title} className="w-6 h-6" src={channel.Avatar_URL} />}
                                                >
                                                    {channel.title}
                                                </AutocompleteItem>
                                            ))
                                        ) : (
                                            <p>No channels available</p>
                                        )}
                                    </Autocomplete>
                                </FormControl>
                            }
                            {
                                selectedChannel.type === 'protected' && (
                                    <FormControl mt={4}>
                                        <FormLabel>Password</FormLabel>
                                        <PasswordInput onChange={handlePasswordChange} />
                                    </FormControl>
                                )
                            }
                        </ModalBody>

                        <ModalFooter>
                            <Button className='midnight hover:bg-slate-700' onClick={handleSubmit}>
                                Join
                            </Button>
                            <Button onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </div>
        </>
    );
}
