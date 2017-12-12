import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
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

export default class UserForm extends React.Component {

    state = {
        firstName: '',
        lastName: '',
        login: ''
    };

    constructor(...args) {
        super(...args);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentWillMount() {
        this.setState({
            firstName: this.props.user.firstName,
            lastName: this.props.user.lastName,
            login: this.props.user.login
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            firstName: nextProps.user.firstName,
            lastName: nextProps.user.lastName,
            login: nextProps.user.login
        });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    render() {
        return (
            <Form>
                <Form.Group inline>
                    <Form.Field>
                        <input name='avatar' className='input-upload-avatar' id='avatar-input' type='file' />
                        <label className='btn-upload-avatar' htmlFor='avatar-input'>
                            <Icon color='blue' name='user' size='huge' circular />
                        </label>
                    </Form.Field>
                    <List>
                        <List.Item>
                            <Form.Input name='login' placeholder='Email' value={this.state.login} onChange={this.handleInputChange} />
                        </List.Item>
                        <List.Item>
                            <Form.Input name='firstName' placeholder='Имя' value={this.state.firstName} onChange={this.handleInputChange} />
                        </List.Item>
                        <List.Item>
                            <Form.Input name='lastName' placeholder='Фамилия' value={this.state.lastName} onChange={this.handleInputChange} />
                        </List.Item>
                    </List>
                </Form.Group>
                <Button type='submit' onClick={() => this.props.updateUser(this.state)}>
                    <Icon name='save' />
                    Сохранить
                </Button>
                <Button type='submit' color='red' onClick={() => this.props.removeUser(this.state)}>
                    <Icon name='trash' />
                    Удалить
                </Button>
            </Form>
        )
    }
}
