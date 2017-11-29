import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import classNames from 'classnames';

import Message from '../../../../rxsupp.core/src/Message';
import { MESSAGE_ADD, USER_UPDATE } from '../../../../rxsupp.core/src/chat';

import './chat.css';

const serverUser = { name: 'server' };

const currentUserSelector = createSelector(
    state => state.users,
    state => state.socket,
    (users, socket) => users.get(socket.get('userId'))
);

const usersSelector = createSelector(
    state => state.users,
    (users) => users.map(u => {
        let login = u.get('login');
        let shortName = login[0] + login[login.length - 1];
        shortName = shortName.toUpperCase();
        return u.set('shortName', shortName);
    })
);

const roomUsersSelector = createSelector(
    currentUserSelector,
    usersSelector,
    (currentUser, users) =>
        users.filter(user => user.get('room') === currentUser.get('room'))
);

const roomMessagesSelector = createSelector(
    roomUsersSelector,
    state => state.messages,
    (users, messages) => {
        let ids = users.map(user => user.get('id'));
        return messages.filter(msg => ids.includes(msg.get('userId')))
    }
);

const mapStateToProps = (state, ownProps) => createSelector(
    usersSelector,
    roomMessagesSelector,
    currentUserSelector,
    (users, messages, currentUser) => {
        if (!currentUser) {
            return { users: [], messages: [] };
        }
        let socketId = currentUser.get('socketId');
        let currentUserId = currentUser.get('id');
        let room = currentUser.get('room');
        const msgUser = msg => users.find(user => user.get('id') === msg.get('userId'));
        let roomUserIds =
            messages = messages
                .map(message => message
                    .set('fromCurrent', message.get('userId') === currentUserId)
                    .set('userName', msgUser(message).get('login')))
                .toJS();
        users = users.filter(user => user.get('status') !== 'disconnect').toJS();
        return {
            users: Object.values(users),
            messages: Object.values(messages),
            socketId,
            room,
            currentUserId
        };
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
            let userItemClass = classNames('users-list__item', {
                'users-list__item_selected': user.room === this.props.room
            });
            let avatarStyle = {
                backgroundColor: user.color
            };
            return (
                <div key={user.login} onClick={() => this.onUserClick(user)} className={userItemClass}>
                    <span className="user-avatar" style={avatarStyle}>{user.shortName}</span>
                    <span className="user-info">
                        <div className="user-name">{user.login || user.name}</div>
                        <div className="user-status">№{user.room}</div>
                    </span>
                </div>
            );
        });
        let winIconClassName = this.state.isMaximized ? 'minimize' : 'maximize';
        let chatClassNames = classNames('chat', {
            maximized: this.state.isMaximized
        });
        return (
            <div className={chatClassNames}>
                {/* <div className="window-controls">
                    <span className={winIconClassName} onClick={this.onWinControlClick}></span>
                </div> */}
                <div className="chat-wrapper">
                    <div className="users-list">
                        {usersItems}
                    </div>
                    <div className="output-wrapper">
                        <div className="output">
                            {messageItems}
                        </div>
                        <textarea className="input" onKeyPress={this.onInputKeyPress} value={this.state.message} onChange={this.onInputChange} placeholder="type a message" ></textarea>
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
        const message = new Message({
            text: this.state.message,
            userId: this.props.currentUserId,
            room: this.props.room
        });
        this.props.chat.addMessage(message, this.props.room);
        this.props.socket.emit(MESSAGE_ADD, message);
        this.setState({ message: '' });
    }

    onUserClick(user) {
        let payload = {
            id: this.props.currentUserId,
            room: user.room
        };
        this.props.chat.updateUser(payload);
        this.props.socket.emit(USER_UPDATE, payload);
    }

    onWinControlClick() {
        let isMaximized = this.state.isMaximized;
        this.setState({
            isMaximized: !isMaximized
        });
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
