import React from 'react';
import {
    Form,
    Grid,
    Button,
    Segment,
    Header,
    Sidebar,
    Menu,
    Icon,
    Divider,
    List,
    Image,
    Label
} from 'semantic-ui-react';
import UsersListItem from './UsersListItem';

export const EmptyListItem = () => (
    <List.Item>
        <List.Content>
            Список пуст
        </List.Content>
    </List.Item>
);

export default class UsersList extends React.Component {

    render() {
        const { users } = this.props;
        let content;
        if (users.length === 0) {
            content = (<EmptyListItem />)
        } else {
            content = users.map(user => (<UsersListItem key={user.login} user={user} />));
        }
        return (
            <div>
                <Button>Добавить</Button>
                <List selection verticalAlign='middle'>
                    {content}
                </List>
            </div>
        );
    }
}
