import React from 'react';
import TicketsList from './TicketsList';
import MessagesList from './MessagesList';
import MessageInput from './MessageInput';

const Chat = ({ messages }) =>
    <div className="chat chat_main-view">
        <MessagesList messages={messages} />
        <MessageInput />
    </div>

export default Chat;
