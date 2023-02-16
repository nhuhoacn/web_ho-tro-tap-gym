const User = require('../models/user');
const db = require('../../config/db');
const bcrypt = require('bcrypt');
const session = require('express-session');
const saltRounds = 10;
const mailer = require('../../util/mailer');
const { TRUE } = require('node-sass');
const { login } = require('./SiteController');

class UserController {
    //[GET] user/register
    register(req, res) {
        res.render('register');
    }

    //[POST] user/register
    addUser(req, res, next) {
        const sql = 'Select * From user where email = ? ';
        db.query(sql, req.body.email, function (err, data) {
            if (data.length > 0) {
                res.send('email đã tồn tại');
            } else {
                bcrypt.hash(
                    req.body.password,
                    saltRounds,
                    function (err, hash) {
                        var user = new User({
                            name: req.body.name,
                            birthday: req.body.birthday,
                            gender: req.body.gender,
                            height: req.body.height,
                            weight: req.body.weight,
                            role: req.body.role,
                            address: req.body.address,
                            email: req.body.email,
                            phone_number: req.body.phone_number,
                            image: req.body.image,
                            fb_link: req.body.fb_link,
                            insta_link: req.body.insta_link,
                            yt_link: req.body.yt_link,
                            fitness_center: req.body.fitness_center,
                            password: hash,
                            authentication: '',
                        });

                        // sendmail
                        try {
                            bcrypt.hash(
                                req.body.email,
                                saltRounds,
                                function (err, hashemail) {
                                    user.authentication = hashemail;
                                    const to = req.body.email;
                                    var html = `Cám ơn bạn đã đăng ký tài khoản <br>  <a href="http://localhost:3000/user/verify?email=${req.body.email}&token=${hashemail}" target="_blank"> CLick vào đây để xác nhận </a>`;
                                    mailer.sendMail(to, html);
                                    console.log(
                                        `http://localhost:3000/user/verify?email=${req.body.email}&token=${hashemail}}`,
                                    );
                                    req.session.user = user;
                                    console.log('session: ', req.session.user);
                                    req.session.save(function (err) {
                                        res.render('login', {
                                            session: req.session,
                                        });
                                    });
                                },
                            );
                        } catch (err) {
                            res.send(err);
                        }
                    },
                );
            }
        });
    }

    //[GET] /user/verify
    verify(req, res) {
        const sql = `INSERT INTO user(name,birthday,gender,height,weight,role,address,
            email,phone_number,image,fb_link,insta_link,yt_link,fitness_center,password,authentication) VALUES (?)`;
        bcrypt.compare(
            req.query.email,
            req.query.token,
            function (err, authentic) {
                console.log(authentic);
                const values = [
                    req.session.user.name,
                    req.session.user.birthday,
                    req.session.user.gender,
                    req.session.user.height,
                    req.session.user.weight,
                    req.session.user.role,
                    req.session.user.address,
                    req.session.user.email,
                    req.session.user.phone_number,
                    req.session.user.image,
                    req.session.user.fb_link,
                    req.session.user.insta_link,
                    req.session.user.yt_link,
                    req.session.user.fitness_center,
                    req.session.user.password,
                    req.session.user.authentication,
                ];
                if (authentic) {
                    db.query(sql, [values], function (err, data) {
                        if (err) {
                            throw err;
                        } else {
                            console.log('user created');
                            const search_user =
                                'Select * From user where email = ? ';
                            db.query(
                                search_user,
                                req.session.user.email,
                                function (err, user) {
                                    req.session.user_id = user[0].user_id;
                                    console.log(req.session);
                                    res.render('home', {
                                        session: req.session,
                                        user: user[0],
                                    });
                                },
                            );
                        }
                    });
                } else {
                    res.send('Khong thanh cong');
                }
            },
        );
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
                                // req.toastr.error('sai mat khau');
                                // console.log(req.toastr.render);
                                res.render('login', { req: req });
                            }
                        },
                    );
                } else {
                    // req.toastr.error('Địa chỉ email không đúng');
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
