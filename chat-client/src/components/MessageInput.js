import React from 'react';

export default class MessageInput extends React.Component {

    constructor(props) {
        super(props);

        this.onInputChange = this.onInputChange.bind(this);
        this.onInputKeyPress = this.onInputKeyPress.bind(this);
        this.state = {};
    }

    render() {
        return (
            <textarea className="input" onKeyPress={this.onInputKeyPress} value={this.state.message} onChange={this.onInputChange} placeholder="Write a message.." ></textarea>
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
        this.props.sendMessage(this.state.message);
    }
}
