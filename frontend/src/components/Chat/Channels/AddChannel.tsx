'use client'
import React, { useState } from 'react';
import {
    useDisclosure,
    Input,
    Select,
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
import { postChannel } from '@/utils/PostChannel';
import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@nextui-org/react';
import { VscGitPullRequestCreate } from "react-icons/vsc";



export default function AddChannel({mutateJoined, mutateAllChannels}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const firstField = React.useRef();
    const [channelType, setChannelType] = useState('public');
    const [title, setTitle] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [password, setPassword] = useState('');
    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)

    const handleTypeChange = (event) => {
        let selectedType = event.target.value;
        if (!selectedType) {
            selectedType = 'public';
        }
        setChannelType(selectedType);
    };
    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async () => {
        if (channelType == 'Public') {
            toast.error('Please Select Channel Type',
                {
                    toastId: 'error1'
                })
            return;
        }
        if (!title || !channelType || (channelType === 'protected' && !password)) {
            toast.error('Please fill all fields',
                {
                    toastId: 'error1'
                })
            return;
        }
        try {
            const data = await postChannel(title, channelType, channelType === 'protected' ? password : undefined);
            mutateJoined()
            mutateAllChannels()
            toast.success('Channel Created Successfully',
                {
                    toastId: 'success1'
                })
            onClose();
        } catch (error) {
            toast.info(error.message,
                {
                    toastId: 'info1'
                })
        }
    };

    return (
        <>
            <div className='w-full'>
                <Button className='bg-midnight border border-midnight-border text-midnight-secondary font-normal py-2 px-4 rounded-lg hover:bg-midnight-light hover:text-midnight w-full' aria-label='Create Channel' startContent={<VscGitPullRequestCreate />} size='sm' onClick={onOpen} >Create Channel</Button>
                <Modal
                    initialFocusRef={initialRef}
                    finalFocusRef={finalRef}
                    isOpen={isOpen}
                    onClose={onClose}
                >
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Create new channel</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <FormControl>
                                <FormLabel>Channel Title</FormLabel>
                                <Input
                                    ref={firstField}
                                    id='title'
                                    placeholder='Please enter Channel name'
                                    onChange={handleTitleChange}
                                />
                            </FormControl>

                            <FormControl mt={4}>
                                <FormLabel>Channel Type</FormLabel>
                                <Select id='type' onChange={handleTypeChange}>
                                    <option value='public'>public</option>
                                    <option value='private'>private</option>
                                    <option value='protected'>protected</option>
                                </Select>
                            </FormControl>
                            {
                                channelType === 'protected' && (
                                    <FormControl mt={4}>
                                        <FormLabel>Password</FormLabel>
                                        <PasswordInput onChange={handlePasswordChange} />
                                    </FormControl>
                                )
                            }
                        </ModalBody>

                        <ModalFooter>
                            <Button className='midnight hover:bg-slate-700' onClick={handleSubmit}>
                                Create
                            </Button>
                            <Button onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </div>
        </>
    );
}
