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

// Settings
app.set('port', process.env.PORT || 3000);

// Mildwares
app.use(morgan('dev'));
app.use(express.json());

//Routes
app.use('/kit/user/', require('./routes/user/user'));
app.use('/kit/user/card/', require('./routes/user/card/card'));
app.use('/kit/user/sync/', require('./routes/user/sync'));
app.use('/kit/user/cs/', require('./routes/user/cs'));
app.use('/kit/user/save_search/', require('./routes/user/save_search'));

app.use('/kit/card/', require('./routes/card/card'));
app.use('/kit/cardholder/', require('./routes/cardholder.routes'));
app.use('/kit/search/', require('./routes/search.routes'));
app.use('/kit/notifications/', require('./routes/notifications.routes'));
app.use('/pic/', require('./routes/picture.routes'));

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


const Card = require("../src/models/card");
const User = require("../src/models/user");



////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
/*
var fs = require("fs");
const importUsers = async () => {
    console.log("\n *STARTING* \n");
    var contents = fs.readFileSync("src/old_data/users.json");
    var users = JSON.parse(contents);
    for (const u of users) {
        let __user = await User.findOne({username: u.username});
        if (__user == null) {
            let user = new User({
                oldid: u.oldid,
                username: u.username,
                email: u.email,
                password: u.password,
                updated: u.updated,
                enabled: true,
                date: u.date,
                cards: u.cards
            });
            await user.save();
        }
    }
    console.log("\n *Users was saved* \n");
    setTimeout(importCards, 1000);
};
const importCards = async () => {
    console.log("\n *STARTING* \n");
    var contents = fs.readFileSync("src/old_data/cards.json");
    var cards = JSON.parse(contents);
    for (const c of cards) {
        let __card = await Card.findOne({cardname: c.cardname});
        if (__card == null) {
            const user = await User.findOne({cards: c.cardname});
            let card = new Card({
                uid: user._id,
                oldid: c.oldid,
                cardname: c.cardname,
                is_private: c.is_private,
                description: c.description,
                name: c.name,
                pictures: c.pictures,
                updated: c.updated,
                date: c.date,
                contacts: c.contacts,
                c_updated: c.c_updated,
                cardholder: c.cardholder,
                k_updated: c.k_updated,
                keepers: c.keepers,
                n_updated: c.n_updated,
                notifications: c.notifications,
            });
            // console.log(card);
            await card.save();
        }
    }
    console.log("\n *Cards was saved* \n");
};

setTimeout(importUsers, 2000);
*/
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// WebSocket
var rc = io     //room card
    .of('/krc')
    .on('connection', socket => {
        const room = socket.handshake['query']['cardname'];
        socket.join(room);
        console.log('SOCKET >>> user joined to room %s', room);

        socket.on('disconnect', function () {
            socket.leave(room);
            console.log('SOCKET >>> user disconnected from room %s', room);
        });
        socket.on('c_updated', msg => {
            console.log(">>>>>> c_updated", room);
            rc.in(room).emit('c_updated', msg);
        });
        socket.on('updated', async msg => {
            console.log(">>>>>> updated", room);
            const card = await Card.findOne({cardname: room});
            if (card != null) {
                msg = card.updated
            }
            rc.in(room).emit('updated', msg);
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









