import React from 'react';
import { Form, Grid, Button, Segment, Header, Sidebar, Menu, Icon, Divider } from 'semantic-ui-react';
import { Switch, Route, Link } from 'react-router-dom';

import UsersPage from '../UsersPage/UsersPage';
import ChatServerManager from '../ChatServerManager/ChatServerManager';

import './DashoboardLayout.css';

export default class DashoboardLayout extends React.Component {

    state = {}

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    render() {
        const { activeItem } = this.state;
        const style = {
            marginLeft: '110px'
        };
        return (
            <div className='l-dashboard'>
                <Menu fixed="left" width='thin' icon='labeled' vertical inverted>
                    <Link className='item' to='/admin/users'>
                        <Icon name='users' />
                        Операторы
                    </Link>
                    <Link className='item' to='/admin/server'>
                        <Icon name='settings' />
                        Сервер
                    </Link>
                    <Menu.Item></Menu.Item>
                </Menu>
                <div style={style}>
                    <Grid centered columns='1' stretched>
                        <Grid.Row>
                            <Grid.Column>
                                <Switch>
                                    <Route path='/admin/users' component={UsersPage} />
                                    <Route exact path='/admin/server' component={ChatServerManager} />
                                </Switch>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
            </div>
        );
    }
}
