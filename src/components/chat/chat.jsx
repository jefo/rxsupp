import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { sendMessage, connectWithUser } from '../../redux/chat/chat';
import store from '../../redux';
import './chat.css';

const serverUser = { name: 'server' };

const mapStateToProps = (state, ownProps) => {
    const users = state.users.toJS();
    let usersArr = Object.values(users);
    if (usersArr.length === 0) {
        return { messages: [], users: [] }
    }
    let messages = Object.values(state.messages.toJS());
    messages = messages.map(msg => {
        let user = msg.userId ? users[msg.userId] : serverUser;
        let userName = user.login? user.login: 'Пользователь';
        return Object.assign({}, msg, { userName, fromCurrent: user.isCurrent })
    });
    usersArr = usersArr.filter(user => user.isOnline && !user.isCurrent);
    return { users: usersArr, messages };
};

const mapDispatchToProps = dispatch => {
    return {
        onSendMessage: e => {
            dispatch(sendMessage(this.message));
        }
    }
};

class Chat extends React.Component {

    constructor(props) {
        super(props);
        this.onInputChange = this.onInputChange.bind(this);
        this.onSendMessage = this.onSendMessage.bind(this);
        this.onInputKeyPress = this.onInputKeyPress.bind(this);
        this.state = {};
    }

    render() {
        let { messages, users } = this.props;
        const messageItems = messages.map(msg => {
            let msgStatusClass = msg.isSent ? 'sent' : 'sending';
            let userClassName = msg.fromCurrent? 'user-name user-name_current': 'user-name';            
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
        return (
            <div className="chat">
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
        store.dispatch(sendMessage(this.state.message));
        this.setState({ message: '' });
    }

    onUserClick(e) {
        store.dispatch(connectWithUser(this.state.message));
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
