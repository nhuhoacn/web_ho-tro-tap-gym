const express = require('express');
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const { deprecate } = require('util');
const flash = require('connect-flash');
const session = require('express-session');
const app = express();
// socket
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

const cookieParser = require('cookie-parser');
const dotenv = require('dotenv').config({ path: __dirname + './util/.env' });
const port = 3000;
const route = require('./routes');

//connect to db
const db = require('./config/db');

app.use('/public', express.static(path.join(__dirname, 'public')));
//session
app.use(cookieParser('secret'));
app.use(
    session({
        secret: 'codeworkrsecret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            SameSite: null,
        },
    }),
);
// //toastr
// app.use(flash());
// app.use(toastr());

app.use(
    express.urlencoded({
        extended: true,
    }),
);

app.use(express.json());
//socket.io
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('new comment', (comment) => {
        console.log('comment: ', comment);
        io.emit('add comment', comment);
    });
    setInterval(function () {
        let date = new Date().toLocaleTimeString();
        socket.send(date);
    }, 1000);
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.broadcast.emit('hi');
});

app.engine(
    'hbs',
    exphbs.engine({
        extname: '.hbs',
        helpers: {
            list: function (page, options) {
                var out = '';
                for (var i = 1; i <= page; i++) {
                    out = out + '<a href="' + i + '">' + options.fn(i) + '</a>';
                }
                return out;
            },
            component: function (array, i, option) {
                return array[i];
            },
            for: function (current, numPage, options) {
                var out = '';
                for (
                    let i = Number(current) - 2;
                    i < Number(current) + 3 && i <= numPage;
                    i++
                ) {
                    if (i > 0 && i == current) {
                        out =
                            out +
                            '<li class="page-item active"> <a class="page-link" href="' +
                            i +
                            '">' +
                            options.fn(i) +
                            '</a> </li>';
                    } else if (i > 0) {
                        out =
                            out +
                            '<li class="page-item "> <a class="page-link" href="' +
                            i +
                            '">' +
                            options.fn(i) +
                            '</a> </li>';
                    }
                    if (i == Number(current) + 2 && i < numPage) {
                        out =
                            out +
                            '<li class="page-item disabled"> <a class="page-link" href="#">...</a> </li>';
                    }
                }
                return out;
            },
            ifManyCond: function (
                v1,
                operator1,
                v2,
                v3,
                operator2,
                v4,
                options,
            ) {
                if (operator1 == '>=' && operator2 == '>=') {
                    return v1 >= v2 && v3 >= v4
                        ? options.fn(this)
                        : options.inverse(this);
                } else if (operator1 == '>=' && operator2 == '<=') {
                    return v1 >= v2 && v3 <= v4
                        ? options.fn(this)
                        : options.inverse(this);
                } else if (operator1 == '<=' && operator2 == '>=') {
                    return v1 <= v2 && v3 >= v4
                        ? options.fn(this)
                        : options.inverse(this);
                } else if (operator1 == '<=' && operator2 == '<=') {
                    return v1 <= v2 && v3 <= v4
                        ? options.fn(this)
                        : options.inverse(this);
                } else if (operator1 == '!=' && operator2 == '!=') {
                    return v1 != v2 && v3 != v4
                        ? options.fn(this)
                        : options.inverse(this);
                }
            },
            ifCond: function (v1, operator, v2, options) {
                switch (operator) {
                    case '==':
                        return v1 == v2
                            ? options.fn(this)
                            : options.inverse(this);
                    case '===':
                        return v1 === v2
                            ? options.fn(this)
                            : options.inverse(this);
                    case '!=':
                        return v1 != v2
                            ? options.fn(this)
                            : options.inverse(this);
                    case '!==':
                        return v1 !== v2
                            ? options.fn(this)
                            : options.inverse(this);
                    case '<':
                        return v1 < v2
                            ? options.fn(this)
                            : options.inverse(this);
                    case '<=':
                        return v1 <= v2
                            ? options.fn(this)
                            : options.inverse(this);
                    case '>':
                        return v1 > v2
                            ? options.fn(this)
                            : options.inverse(this);
                    case '>=':
                        return v1 >= v2
                            ? options.fn(this)
                            : options.inverse(this);
                    case '&&':
                        return v1 && v2
                            ? options.fn(this)
                            : options.inverse(this);
                    case '||':
                        return v1 || v2
                            ? options.fn(this)
                            : options.inverse(this);
                    default:
                        return options.inverse(this);
                }
            },
        },
    }),
);
app.set('view engine', 'hbs'); //set sử dụng view là engine handlebars
app.set('views', path.join(__dirname, 'resources', 'views'));
//routes init
route(app);

server.listen(port, () =>
    console.log('App listening at http://localhost:', port),
);
