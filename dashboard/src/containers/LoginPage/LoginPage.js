import React from 'react';
import { Form, Grid, Button, Segment, Header } from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css';
import './LoginPage.css';

export default class LoginPage extends React.Component {
    render() {
        return (
            <Grid className='l-login' centered columns='2' verticalAlign='middle'>
                <Grid.Row>
                    <Grid.Column className="l-login__column" width={7}>
                        <Header  color='teal' size='large'>Log-in into your account</Header>                        
                        <Segment>
                            <Form>
                                <Form.Input icon='user' iconPosition='left' placeholder='Login' />
                                <Form.Input icon='lock' iconPosition='left' placeholder='Password' type="password" />
                                <Button color='teal' fluid type='submit'>Login</Button>
                            </Form>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}
