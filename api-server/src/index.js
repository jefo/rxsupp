import restify from 'restify';
import mongoose from 'mongoose';
import path from 'path';

import seed from './seed';
import User from './models/User';
import ChatServer from './chat/Server';

mongoose.connect('mongodb://localhost/rxsupp', { useMongoClient: true });
mongoose.Promise = global.Promise;

const api = restify.createServer({
    name: 'rxsupp.admin',
    version: '1.0.0'
});

const chatServer = new ChatServer({ httpServer: api.server });
chatServer.start();

const corsMiddleware = require('restify-cors-middleware');

const cors = corsMiddleware({
    origins: ['*'],
    allowHeaders: ['API-Token'],
    exposeHeaders: ['API-Token-Expiry']
});

api.pre(cors.preflight);
api.use(cors.actual);

api.use(restify.plugins.acceptParser(api.acceptable));
api.use(restify.plugins.queryParser());
api.use(restify.plugins.bodyParser());

api.get('/users', (req, res, next) => {
    User.find((err, users) => {
        if (err) res.send(500, 'Error.');
        res.send(users.reduce((acc, next) => {
            acc[next._id] = next;
            return acc;
        }, {}));
        return next();
    });
});

api.get('/users/:login', (req, res, next) => {
    User.findOne({ login: req.params.login }, (err, user) => {
        if (err) res.send(500, 'Error.');
        res.send(user);
    });
    next();
});

api.post('/users', (req, res, next) => {
    let user = new User(req.params);
    user.save(err => {
        if (err) res.send(500, err);
        res.send(user);
        next();
    });
});

api.put('/users/:login', (req, res, next) => {
    User.findOneAndUpdate({ login: req.params.login }, req.params, (err, user) => {
        if (err) {
            res.send(400, err)
        } else {
            res.send(user);
        }
    });
    return next();
});

api.del('/users/:login', (req, res, next) => {
    User.remove({ login: req.params.login }, err => {
        if (err) {
            res.send(400, err);
        } else {
            res.send(200, { login: req.params.login });
        }
    });
    return next();
});

api.listen(8080, () => {
    console.log('http api %s listening at %s', api.name, api.url);
    console.log('socket %s listening at %s', api.name, api.url);
});
