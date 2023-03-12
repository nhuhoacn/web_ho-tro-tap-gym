const user = require('../models/user');
const { mutipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
const db = require('../../config/db');
const { render } = require('ejs');
const moment = require('moment');

class SiteController {
    //[GET] /
    index(req, res, next) {
        res.render('home', { session: req.session });

        const a = moment('2017-07-25');
        const b = moment('2017-07-10');
        console.log(b.diff(a, 'hours'));
    }

    //[GET] /search
    search(req, res) {
        res.render('search');
    }
}

module.exports = new SiteController();
