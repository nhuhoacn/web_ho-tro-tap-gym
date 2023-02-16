const express = require('express');
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const { deprecate } = require('util');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv').config({ path: __dirname + './util/.env' });
const app = express();
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
        cookie: {},
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

app.engine(
    'hbs',
    exphbs.engine({
        extname: '.hbs',
        helpers: {
            list: function (page, options) {
                var out = '';
                for (var i = 1; i <= page; i++) {
                    // out = out + '<li class="page-item "><a class="page-link" href="' + i + '">' + options.fn(i) + '</a></li>'
                    out = out + '<a href="' + i + '">' + options.fn(i) + '</a>';
                }
                return out;
            },
        },
    }),
);
app.set('view engine', 'hbs'); //set sử dụng view là engine handlebars
app.set('views', path.join(__dirname, 'resources', 'views'));
//routes init
route(app);

app.listen(port, () => console.log('App listening at http://localhost:', port));
