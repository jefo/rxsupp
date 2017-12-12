import User from './models/User';

export default () => {
    let users = [
        new User({ login: 'john', password: '123' }),
        new User({ login: 'jane', password: '123' })
    ];
    users.forEach(u => u.save());
}
