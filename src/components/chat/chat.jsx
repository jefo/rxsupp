import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { sendMessage } from '../../redux/chat/chat';
import store from '../../redux';
import './chat.css';

const mapStateToProps = (state, ownProps) => {
    let messages = Object.values(state.toJS());
    console.log('msgs', messages);
    console.log('ownProps', ownProps);
    
    return { messages };
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
        this.state = {};
    }

    render() {
        let { messages } = this.props;
        const messageItems = messages.map(msg => {
            let msgClass = msg.isInc? 'response-message': 'sent-message';
            return <div key={msg.timestamp} className={msgClass}>{msg.text}</div>
        });
        return (
            <div className="chat">
                <div className="output">
                    {messageItems}
                </div>
                <textarea className="input" value={this.state.message} onChange={this.onInputChange}></textarea>
                <button onClick={this.onSendMessage}>Send</button>
            </div>
        )
    }

    onInputChange(e) {
        this.setState({
            message: e.target.value
        });
    }

    onSendMessage() {
        store.dispatch(sendMessage(this.state.message));
        this.setState({ message: '' });
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
