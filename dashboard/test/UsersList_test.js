import { shallow, configure } from 'enzyme';
import React from 'react';
import UsersList, { EmptyListItem } from '../src/components/Users/UsersList';
import UsersListItem from '../src/components/Users/UsersListItem'
import Adapter from 'enzyme-adapter-react-16';

describe('<UsersList/>', () => {

    beforeAll(() => {
        configure({ adapter: new Adapter() });
    })

    it('should render <EmptyListItem /> if no users', () => {
        let users = [];
        let element = shallow(<UsersList users={users} />);
        expect(element.find(EmptyListItem).length).toBe(1);
    });

    it('should render <UsersListItem />', () => {
        let users = [
            { login: 'joe', avatar: 'joe.jpg' },
            { login: 'james', avatar: 'james.jpg' },
            { login: 'jeff', avatar: 'jeff.jpg' },
            { login: 'johny', avatar: 'johny.jpg' },
            { login: 'junior', avatar: 'junior.jpg' }
        ];
        let element = shallow(<UsersList users={users} />);
        expect(element.find(UsersListItem).length).toBe(5);
    });
});
