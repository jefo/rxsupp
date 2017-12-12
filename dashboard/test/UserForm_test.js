import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import UserForm from '../src/components/Users/UserForm';
import { List, Image } from 'semantic-ui-react';
import {
    Form
} from 'semantic-ui-react';

describe('<UserForm />', () => {

    beforeAll(() => {
        configure({ adapter: new Adapter() })
    });

    it('should render with initial values', () => {
        let a;
        let user = { login: 'joe', firstName: 'joe', lastName: 'doe' };
        const element = shallow(<UserForm user={user} />);
        const inputs = element.find(Form.Input);
        Object.keys(user).forEach(key => {
            let input = element.find(`[name="${key}"]`);
            expect(input.length).toBe(1);
            expect(input.props().value).toBe(user[key]);
        });
    });
});
