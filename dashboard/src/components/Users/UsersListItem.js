import React from 'react';
import { List, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class UsersListItem extends React.Component {
    render() {
        const { user } = this.props;
        return (
            <List.Item key={user.login} as={Link} to={`/admin/users/${user.login}`}>
                <Image avatar src={user.avatar} />
                <List.Content>
                    <List.Header>
                        {user.login}
                    </List.Header>
                </List.Content>
            </List.Item>
        )
    }
}

export default UsersListItem;
