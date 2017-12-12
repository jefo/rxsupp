import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import UsersListItem from '../src/components/Users/UsersListItem';
import { List, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

describe('<UsersListItem />', () => {

    beforeAll(() => {
        configure({ adapter: new Adapter() });
    });

    it('render', () => {
        let user = { login: 'joe', avatar: 'joe.jpg' };
        let element = shallow(<UsersListItem user={user} />);
        const props = element.props();
        expect(props.as).toBe(Link);
        expect(props.to).toBe(`/admin/users/joe`);
        const image = element.find(Image)
        expect(image.props().avatar).toBe(true);
        expect(image.props().src).toBe('joe.jpg');
    });
});
