const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const morgan = require('morgan');
const path = require('path');
const crypto = require('crypto');
const cors = require('cors');

const { mongoose } = require('./database');
const { generate_key } = require('./generate_key');

const MONGO_URL = 'mongodb://127.0.0.1/kitkard';

const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

// var corsOptions = {
//     origin: 'http://localhost:5000',
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// };
// app.use(cors(corsOptions));

// app.use(function (req, res, next) {
//     res.setHeader('X-Powered-By', 'Kitkard');
//     // res.setHeader('access-control-allow-origin', 'http://localhost:5000');
//     // res.setHeader('access-control-allow-credentials', true);
//     next();
// });

app.use(function (req, res, next) {
    // res.setHeader('X-Powered-By', 'Kitkard');
    var allowedOrigins = ['http://192.168.1.101', 'http://localhost', 'http://192.168.1.123', 'http://localhost:8080', 'http://192.168.1.101:5000', '46.216.139.237:443'];
    var origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1) {
        res.header('Access-Control-Allow-Origin', origin);
    } else {
        res.header("Access-Control-Allow-Origin", "*");
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // res.header('Content-Type', 'application/json');
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
// /+username
app.get(/\/＋.*/, (req, res) => {
    console.log(req.sessionID);
    req.session.cuenta = req.session.cuenta ? req.session.cuenta + 1 : 1;
    res.send(`Has visto esta pagina: ${req.session.cuenta} veces`);
});
// /+username
app.get(/\/%EF%BC%8B.*/, (req, res) => {
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
app.use('/kit/reg/', require('./routes/user/registration'));
app.use('/kit/auth/', require('./routes/user/auth'));
app.use('/kit/login/', require('./routes/user/login'));
app.use('/kit/logout/', require('./routes/user/logout'));

app.use('/kit/user/cs/', require('./routes/user/cs'));
app.use('/kit/user/sync/', require('./routes/user/sync'));
app.use('/kit/user/save/', require('./routes/user/save'));

app.use('/kit/user/card/create/', require('./routes/user/card/create'));
app.use('/kit/user/card/', require('./routes/user/card/card'));
app.use('/pic/', require('./routes/picture.routes'));
app.use('/kit/card/', require('./routes/card/card'));

app.use('/kit/notifications/', require('./routes/notifications/notifications.routes'));
app.use('/kit/notifications/sync/', require('./routes/notifications/sync'));
app.use('/kit/notifications/viewed/', require('./routes/notifications/viewed'));
app.use('/kit/notification/action/', require('./routes/notifications/action.route'));

app.use('/kit/friends/', require('./routes/friends/friends.routes'));
app.use('/kit/friends/sync/', require('./routes/friends/sync'));


app.use('/kit/search/', require('./routes/search.routes'));
app.use('/kit/user/save_search/', require('./routes/user/save_search'));
app.use('/kit/user/sync_search/', require('./routes/user/sync_search'));

app.use('/kit/cardholder/add/', require('./routes/cardholder/add'));
app.use('/kit/cardholder/remove/', require('./routes/cardholder/remove'));
app.use('/kit/cardholder/', require('./routes/cardholder/cardholder.routes'));


app.use('/kit/share/', require('./routes/share'));


// app.use('/kit/user/', require('./routes/user/user'));


// Developments routes
// app.use('/dev/translations/', express.static(path.join(__dirname, "../dev/translations")));
// app.use('/dev/translations/api/', require('./routes/dev.translations.routes'));

//Static files
// console.log(path.join(__dirname, "public"));
// WebApp Client
// app.use(express.static(path.join(__dirname, "public/index.html")));
app.use(express.static(path.join(__dirname, "/public")));

console.log(path.join(__dirname, 'public/index.html'));

// app.get('/', function (req, res) {
//    // res.writeHead(200, {
//    //     'Content-Type': 'text/html'
//    // });
//    res.sendFile(path.join(__dirname, 'public/index.html'));
// });

// Starting server
server.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});

//
// const mongo = require('mongo-observer').create({
//     host: 'localhost',
//     port: 27017,
//     dbName: 'kitkard',
//     collections: ['cards', "users"]
// });
//
// mongo.on('*:*:*', function (collection, operation, _id, data) {
//     console.log('OBSERVER: collection:', collection);
//     console.log('OBSERVER: operation:', operation);
//     console.log('OBSERVER: _id:', _id);
//     console.log('OBSERVER: data:', data);
// });


const Card = require("./models/Card");
const User = require("./models/User");


// WebSocket
var rc = io     //room card
    .of('/krc')
    .on('connection', socket => {
        const room = socket.handshake['query']['room'];
        socket.join(room);
        console.log('SOCKET >>> user joined to room %s', room);

        socket.on('disconnect', function () {
            socket.leave(room);
            console.log('SOCKET >>> user disconnected from room %s', room);
        });


        socket.on('updated', async msg => {
            rc.in(room).emit('updated', msg);
        });

        socket.on('friends_updated', msg => {
            console.log(">>>>>> friends_updated", room);
            rc.in(room).emit('friends_updated', msg);
        });
        socket.on('notifications_updated', msg => {
            console.log(">>>>>> notifications_updated", room);
            rc.in(room).emit('notifications_updated', msg);
        });

        socket.on('search_updated', async msg => {
            console.log(">>>>>> search_updated", room, msg);
            rc.in(room).emit('search_updated', msg);
        });



        socket.on('created', msg => {
            console.log(">>>>>> created", room);
            rc.in(room).emit('created');
        });
        socket.on('deleted', msg => {
            console.log(">>>>>> deleted", room);
            rc.in(room).emit('deleted');
        })

    });



////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


// require('./__test__/moveNotifications');
// require('./__test__/moveFriends');



