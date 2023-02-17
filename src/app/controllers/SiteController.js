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

    //[GET] /register
    register(req, res) {
        res.render('register');
    }

    //[POST] /register
    addUser(req, res, next) {
        const user = new user(req.body);
        const values = [
            user.name,
            user.birthday,
            user.gender,
            user.height,
            user.weight,
            user.email,
            user.phone_number,
        ];
        const search_email = 'select email from user where email = ?';
        const sql =
            'INSERT INTO user(name,birthday,gender,height,weight,email,phone_number) VALUES (?)';
        db.query(search_email, user.email, function (err, data) {
            if (data.length > 0) {
                console.log('Email đã tồn tại');
                res.render('register');
            } else {
                db.query(sql, [values], function (err, data) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('user created');
                        const sql = 'Select * From user where email = ? ';
                        db.query(sql, user.email, function (err, data) {
                            req.session.user_id = data[0].user_id;
                            res.render('home', {
                                session: req.session,
                                user: data[0],
                            });
                        });
                    }
                });
            }
        });
    }

    //[GET] /login
    login(req, res) {
        res.render('login', { session: req.session });
    }

    //POST /login
    rememberUser(req, res, next) {
        const user_email = req.body.user_email;
        const user_password = req.body.user_password;
        var user = false;
        if (user_email && user_password) {
            const sql = 'Select * From user where email = ? ';
            db.query(sql, user_email, function (err, data) {
                if (data) {
                    if (data[0].password == user_password) {
                        req.session.user_id = data[0].user_id;
                        return res.render('home', {
                            session: req.session,
                            user: data[0],
                        });
                    } else {
                        res.send('Sai mat khau');
                    }
                } else {
                    res.send('Địa chỉ email không đúng');
                }
            });
        } else {
            res.send('Hãy nhập địa chỉ email và password');
            // res.end()
        }
        // res.render('login', {session : req.session});
    }

    // [GET] /logout
    logout(req, res) {
        req.session.destroy();
        res.render('home');
    }

    //[GET] /resetpass
    resetpass(req, res) {
        res.render('resetpass');
    }
}

module.exports = new SiteController();
