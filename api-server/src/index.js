import restify from 'restify';
import mongoose from 'mongoose';
import childProcess from 'child_process';
import path from 'path';

import seed from './seed';
import User from './models/User';



mongoose.connect('mongodb://localhost/rxsupp', { useMongoClient: true });
mongoose.Promise = global.Promise;

// seed();

const server = restify.createServer({
    name: 'rxsupp.admin',
    version: '1.0.0'
});

// server.use(function crossOrigin(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     return next();
// });

const corsMiddleware = require('restify-cors-middleware')

const cors = corsMiddleware({
 origins: ['*'],
 allowHeaders: ['API-Token'],
 exposeHeaders: ['API-Token-Expiry']
})

server.pre(cors.preflight);
server.use(cors.actual);

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.get('/users', (req, res, next) => {
    User.find((err, users) => {
        if (err) res.send(500, 'Error.');
        res.send(users.reduce((acc, next) => {
            acc[next._id] = next;
            return acc;
        }, {}));
        return next();
    });
});

server.get('/users/:login', (req, res, next) => {
    User.findOne({ login: req.params.login }, (err, user) => {
        if (err) res.send(500, 'Error.');
        res.send(user);
    });
    next();
});

server.post('/users', (req, res, next) => {
    let user = new User(req.params);
    user.save(err => {
        if (err) res.send(500, err);
        res.send(user);
        next();
    });
});

server.put('/users/:login', (req, res, next) => {
    User.findOneAndUpdate({ login: req.params.login }, req.params, (err, user) => {
        if (err) {
            res.send(400, err)
        } else {
            res.send(user);
        }
    });
    return next();
});

server.del('/users/:login', (req, res, next) => {
    User.remove({ login: req.params.login }, err => {
        if (err) {
            res.send(400, err);
        } else {
            res.send(200, { login: req.params.login });
        }
    })
    return next();
});

let socketProc;

server.post('/chat', (req, res, next) => {
    console.log('chat', req.params);
    const cwd = path.resolve('../rxsupp.node-server');
    if (req.params.status === 'start') {
        socketProc = childProcess.spawn('yarn start', { cwd }, (err, stdout, stderr) => {
            if (err) {
                res.send(500, err);
            } else {
                res.send({ status: 'run' });
            }
        });
    } else if (req.params.status === 'stop' && socketProc) {
        socketProc.kill('SIGINT');
    } else {
        res.send(400);
    }
    return next();
});

server.listen(8080, () => {
    console.log('%s listening at %s', server.name, server.url);
});
