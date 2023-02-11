const user = require('../models/user');
const db = require('../../config/db');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { render } = require('ejs');

class UserController {
    //[GET] /register
    register(req, res) {
        res.render('register');
    }

    //[POST] user/register
    addUser(req, res, next) {
        const search_email = 'select email from user where email = ?';
        const sql =
            'INSERT INTO user(name,birthday,gender,height,weight,role,address,email,phone_number,image,fb_link,insta_link,yt_link,fitness_center,password) VALUES (?)';
        db.query(search_email, req.body.email, function (err, data) {
            if (data.length > 0) {
                res.send('email đã tồn tại');
                res.render('register');
            } else {
                bcrypt.hash(
                    req.body.password,
                    saltRounds,
                    function (err, hash) {
                        const values = [
                            req.body.name,
                            req.body.birthday,
                            req.body.gender,
                            req.body.height,
                            req.body.weight,
                            req.body.role,
                            req.body.address,
                            req.body.email,
                            req.body.phone_number,
                            req.body.image,
                            req.body.fb_link,
                            req.body.insta_link,
                            req.body.yt_link,
                            req.body.fitness_center,
                            hash,
                        ];
                        db.query(sql, [values], function (err, data) {
                            if (err) {
                                throw err;
                            } else {
                                console.log('user created');
                                const sql =
                                    'Select * From user where email = ? ';
                                db.query(
                                    sql,
                                    req.body.email,
                                    function (err, data) {
                                        req.session.user_id = data[0].user_id;
                                        res.render('home', {
                                            session: req.session,
                                            user: data[0],
                                        });
                                    },
                                );
                            }
                        });
                    },
                );
            }
        });
    }

    //[GET] user/login
    login(req, res) {
        res.render('login', { session: req.session });
    }

    //POST user/login
    rememberUser(req, res, next) {
        const user_email = req.body.user_email;
        const user_password = req.body.user_password;
        var user = false;
        if (user_email && user_password) {
            const sql = 'Select * From user where email = ? ';
            db.query(sql, user_email, function (err, data) {
                if (data.length > 0) {
                    bcrypt.compare(
                        user_password,
                        data[0].password,
                        function (err, authentic) {
                            console.log(data[0].password);
                            console.log(user_password);
                            console.log(authentic);
                            if (authentic) {
                                req.session.user_id = data[0].user_id;
                                return res.render('home', {
                                    session: req.session,
                                    user: data[0],
                                });
                            } else {
                                req.toastr.error('sai mat khau');
                                console.log(req.toastr.render);
                                res.render('login', { req: req });
                            }
                        },
                    );
                } else {
                    req.toastr.error('Địa chỉ email không đúng');
                    res.render('login', { req: req });
                    // return res.send("Địa chỉ email không đúng");
                }
            });
        } else {
            res.send('Hãy nhập địa chỉ email và password');
            // res.end()
        }
    }

    // [GET] user/logout
    logout(req, res) {
        req.session.destroy();
        res.render('home');
    }

    //[GET] user/resetpass
    resetpass(req, res) {
        res.render('resetpass');
    }
}

module.exports = new UserController();
