import React from 'react';
import Chat from '../Chat';
import { Segment, Menu, Input } from 'semantic-ui-react';

const OperatorLayout = ({ tickets, messages, attachments }) =>
    <div class='l-operator'>
        <Segment>
            <Menu>
                <Menu.Item>
                    Сообщения
                </Menu.Item>
                <Menu.Item>
                    Файлы
                </Menu.Item>
                <Menu.Item position='right'>
                    <Input icon='search' placeholder='Искать сообщения..' />
                </Menu.Item>
            </Menu>
        </Segment>
        <Chat messages={messages} />
    </div>

export default OperatorLayout;
