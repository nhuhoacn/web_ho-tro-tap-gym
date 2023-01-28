const Course = require('../models/Course');
const { mutipleMongooseToObject } = require('../../util/mongoose');

class SiteController {
    //[GET] /
    index(req, res, next) {
        Course.find({})
            .then((courses) => {
                res.render('home', {
                    courses: mutipleMongooseToObject(courses),
                });
            })
            .catch(next);
        // res.render('home');
    }

    //[GET] /search
    search(req, res) {
        res.render('search');
    }

    //[GET] /register
    register(req, res) {
        res.render('register');
    }

    //[GET] /login
    login(req, res) {
        res.render('login');
    }
}

module.exports = new SiteController();
