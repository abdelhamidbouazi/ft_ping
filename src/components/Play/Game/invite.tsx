import { DataContext } from "../context";
import { useState, useContext } from 'react';

function Invite( props) {
    const [inputValue, setInputValue] = useState('');
    const {globalSocket} = useContext(DataContext);


    const handleSubmit = (event:any) => {

        globalSocket.emit('Invite', { username1: '', username2: props.username2 });
    };

    return (
        <button onClick={handleSubmit}>
            invite
        </button>
    );
}

export default Invite;
