import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { sendMessage } from '../../redux/chat/chat';
import store from '../../redux';
import './chat.css';

const mapStateToProps = (state, ownProps) => {
    let messages = Object.values(state.messages.toJS());
    let users = state.users.toJS();
    messages = messages.map(msg => Object.assign({}, msg, { userName: users[msg.userId].name }));
    users = Object.values(users);
    return { users, messages };
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
        let { messages } = this.props;
        const messageItems = messages.map(msg => {
            let msgStatusClass = msg.isSent ? 'sent' : 'sending';
            return (<div key={msg.timestamp}>
                <span className="user-name">{msg.userName}:&nbsp;</span>
                <span className={'msg ' + msgStatusClass}>{msg.text}</span>
            </div>);
        });
        return (
            <div className="chat">
                <div className="output">
                    {messageItems}
                </div>
                <textarea className="input" onKeyPress={this.onInputKeyPress} value={this.state.message} onChange={this.onInputChange}></textarea>
                <button className="btn-send" onClick={this.onSendMessage}>Send</button>
            </div>
        )
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
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
