const user = require('../models/user');
const { mutipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
const db = require('../../config/db');
const { render } = require('ejs');

class SiteController {
    //[GET] /
    index(req, res, next) {
        res.render('home', { session: req.session });
    }

    //[GET] /search
    search(req, res) {
        res.render('search');
    }
}

module.exports = new SiteController();
