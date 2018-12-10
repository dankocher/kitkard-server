const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const morgan = require('morgan');
const path = require('path');
const crypto = require('crypto');

const { mongoose } = require('./database');
const { generate_key } = require('./generate_key');

const MONGO_URL = 'mongodb://127.0.0.1/kitkard';

const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(function (req, res, next) {
    res.setHeader('X-Powered-By', 'Kitkard');
    next();
});

app.use(session({
    name: "__kitess",
    secret: "kitkardkey14112016",
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
        url: MONGO_URL,
        autoReconnect: true
    }),
    // cookie: {
        // path: "/",
    // }
    // cookie: { secure: true }    //Only for https
}));

// /+username
app.get(/\/\+.*/, (req, res) => {
    console.log(req.sessionID);
    req.session.cuenta = req.session.cuenta ? req.session.cuenta + 1 : 1;
    res.send(`Has visto esta pagina: ${req.session.cuenta} veces`);
});

// Settings
app.set('port', process.env.PORT || 3000);

// Mildwares
app.use(morgan('dev'));
app.use(express.json());

//Routes
app.use('/kit/user/card/', require('./routes/user.card.routes'));
app.use('/kit/user', require('./routes/user.routes'));
app.use('/kit/card', require('./routes/card.routes'));

//Static files
// console.log(path.join(__dirname, "public"));
// WebApp Client
app.use(express.static(path.join(__dirname, "../web")));


// Starting server
server.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});


// WebSocket
users = [];
connections = [];
var kws = io     // kitkard websocket
    .of('/kws')
    .on('connection', socket => {
        connections.push(socket);
        console.log("Connected: %s sockets connected", connections.length);

        socket.on('username', (data) => {
            // console.log(socket);
        });

        socket.on('disconnect', data => {
            connections.splice(connections.indexOf(socket), 1);
            console.log("Disconnected: %s sockets connected", connections.length);
        })
    });

var rc = io     //room card
    .of('/krc/:cardname')
    .on('connection', socket => {
        // var room = socket.handshake['query']['rc'];
        // var room = socket.handshake['query']['rc'];

        socket.join(room);
        console.log('user joined to room %s', room);

        socket.on('disconnect', function () {
            socket.leave(room);
            console.log('user disconnected');
        });

        socket.on('changed', msg => {
            io.to(room).emit('changed', msg);
        })

    });
