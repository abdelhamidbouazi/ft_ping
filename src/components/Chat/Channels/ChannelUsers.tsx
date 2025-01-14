'use client'
import { useEffect, useState } from 'react';
import { Avatar } from '@chakra-ui/react';
import get_Chats from '@/utils/get_Chat';

const ChannelUsers = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const fetchFriends = async () => {
            const friendsData = await get_Chats();
            setUsers(friendsData);
        }
        fetchFriends();
    }, []);
    return (
        <div>
            {users.map((chat) => (
                chat.users_object.map((user, userIndex) => (
                    chat.users_names[0] !== user.username && (
                        <UserChatCard
                            key={user.id}
                            name={user.displayName}
                            src={user.Avatar_URL}
                            isSelected={selectedUser === user.id}
                            onClick={() => {
                                setSelectedUser(user.id);
                            }}
                        />
                    )
                ))
            ))}
        </div>
    );
};

const UserChatCard = ({ name, src, isSelected, onClick }) => {
    const bgColor = isSelected ? 'bg-gray-700' : 'hover:bg-gray-700';

    return (
        <>
            <button className={`${bgColor} flex flex-row items-center rounded-xl p-2 w-full mt-2 border border-gray-700`} onClick={onClick}>
                <Avatar name={name} src={src} />
                <div className="ml-2 text-sm font-semibold">{name}</div>
            </button>
        </>
    );
};

export default ChannelUsers;
