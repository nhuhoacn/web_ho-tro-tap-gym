const user = require('../models/user');
const { mutipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
const db = require('../../config/db');
const { render } = require('ejs');
const moment = require('moment');

class SiteController {
    //[GET] /
    index(req, res, next) {
        const search_blog =
            'select *from blog order BY date_create_blog DESC LIMIT 3;';
        const pt = 'select *from user where role = 2 LIMIT 3';

        db.query(search_blog, function (err, blog) {
            db.query(pt, function (err, pt) {
                for (let i = 0; i < 3; i++) {
                    let date = moment(
                        blog[i].date_create_blog,
                        'YYYY-MM-DD',
                    ).get('date');
                    let month = moment(
                        blog[i].date_create_blog,
                        'YYYY-MM-DD',
                    ).format('MMMM');
                    let year = moment(
                        blog[i].date_create_blog,
                        'YYYY-MM-DD',
                    ).get('year');
                    blog[i].date = date;
                    blog[i].month = month;
                    blog[i].year = year;

                    if (blog[i].author == null) {
                        blog[i].author = 'Admin';
                    }
                }
                res.render('home', {
                    session: req.session,
                    blog_home: blog,
                    pt_home: pt,
                });
            });
        });
    }

    //[GET] /search
    search(req, res) {
        res.render('search');
    }
}

module.exports = new SiteController();
