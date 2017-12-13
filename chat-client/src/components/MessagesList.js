import React from 'react';

export const Message = ({ message }) =>
    <div className="message">
        <div className={message.userClassName}>{message.userName}</div>
        <div className={message.textClassName}>{message.text}</div>
    </div>

const MessageList = ({ messages }) =>
    <div className='messages'>
        {messages.map(m => <Message message={m} />)}
    </div>

export default MessagesList;
