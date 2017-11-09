import React from 'react';
import './chat.css';

export default class Chat extends React.Component {
    render() {
        return (
            <div className="chat">
                <div className="output">
                    <div className="sent-message">Hello</div>
                    <div className="response-message">Hi</div>
                </div>
                <textarea className="input"></textarea>
            </div>
        )
    }
}
