import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import classNames from 'classnames';
import store, { chatService } from '../../redux';

import './chat.css';

const serverUser = { name: 'server' };

const mapStateToProps = (state, ownProps) => createSelector(
    state => state.users,
    state => state.messages,
    state => state.connection,
    (users, messages, connection) => {
        let socketId = connection.get('socketId');
        if (!socketId) {
            return { users: [], messages: [] };
        }
        let currentUser = users.find(user => user.get('socketId') === socketId);
        if (!currentUser) {
            return { users: [], messages: [] };
        }
        messages = messages
            .filter(message =>
                message.get('roomId') === currentUser.get('roomId'))
            .map(message =>
                message
                    .set('fromCurrent', message.get('socketId') === socketId)
                    .set('userName', users.find(user => user.get('socketId') === message.get('socketId')).get('login')))
            .toJS();
        users = users.filter(user => user.get('status') !== 'disconnect' && user.get('socketId') !== socketId).toJS();
        return { users: Object.values(users), messages: Object.values(messages) };
    }
);

const mapDispatchToProps = dispatch => {
    return {
        onSendMessage: e => {
            // dispatch(sendMessage(this.message));
        }
    }
};

class Chat extends React.Component {

    constructor(props) {
        super(props);

        this.onInputChange = this.onInputChange.bind(this);
        this.onSendMessage = this.onSendMessage.bind(this);
        this.onInputKeyPress = this.onInputKeyPress.bind(this);
        this.onWinControlClick = this.onWinControlClick.bind(this);
        this.state = {};
    }

    render() {
        let { messages, users } = this.props;
        const messageItems = messages.map(msg => {
            let msgStatusClass = msg.isSent ? 'sent' : 'sending';
            let userClassName = msg.fromCurrent ? 'user-name user-name_current' : 'user-name';
            return (
                <div key={msg.timestamp}>
                    <span className={userClassName}>{msg.userName}:&nbsp;</span>
                    <span className={'msg ' + msgStatusClass}>{msg.text}</span>
                </div>
            );
        });
        const usersItems = users.map(user => {
            return (
                <div key={user.login} onClick={() => this.onUserClick(user.id)} className='users-list__item'>
                    {user.login || user.name}
                </div>
            );
        });
        let winIconClassName = this.state.isMaximized ? 'minimize' : 'maximize';
        let chatClassNames = classNames('chat', {
            maximized: this.state.isMaximized
        });
        return (
            <div className={chatClassNames}>
                <div className="window-controls">
                    <span className={winIconClassName} onClick={this.onWinControlClick}></span>
                </div>
                <div className="chat-wrapper">
                    <div className="users-list">
                        {usersItems}
                    </div>
                    <div className="output-wrapper">
                        <div className="output">
                            {messageItems}
                        </div>
                        <textarea className="input" onKeyPress={this.onInputKeyPress} value={this.state.message} onChange={this.onInputChange}></textarea>
                        <button className="btn-send" onClick={this.onSendMessage}>Send</button>
                    </div>
                </div>
            </div>
        );
    }

    onInputChange(e) {
        this.setState({
            message: e.target.value
        });
    }

    onInputKeyPress(e) {
        if (e.key !== 'Enter') {
            return;
        }
        e.preventDefault();
        this.sendMessage();
    }

    onSendMessage() {
        this.sendMessage();
    }

    sendMessage() {
        chatService.sendMessage(this.state.message);
        this.setState({ message: '' });
    }

    onUserClick(e) {
        // store.dispatch(connectWithUser(this.state.message));
    }

    onWinControlClick() {
        let isMaximized = this.state.isMaximized;
        this.setState({
            isMaximized: !isMaximized
        });
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
