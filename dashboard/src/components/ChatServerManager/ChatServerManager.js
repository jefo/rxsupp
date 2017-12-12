import React from 'react';
import { Form, Grid, Button, Segment, Header, Sidebar, Menu, Icon, Divider } from 'semantic-ui-react';

export default class ChatServerManager extends React.Component {

    constructor(...args) {
        super(...args);
        this.state = {
            btnIcon: 'play'
        };
    }

    render() {
        const { btnIcon } = this.state;
        return (
            <div>
                <div>
                    <Button><Icon name={btnIcon} />Run</Button>
                </div>
            </div>
        );
    }
}
