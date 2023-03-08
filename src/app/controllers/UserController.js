const User = require('../models/user');
const db = require('../../config/db');
const bcrypt = require('bcrypt');
const session = require('express-session');
const saltRounds = 10;
const mailer = require('../../util/mailer');
const { TRUE } = require('node-sass');
const { login } = require('./SiteController');
const moment = require('moment');

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
                        req.session.user = user;
                        // sendmail
                        bcrypt.hash(
                            req.body.email,
                            saltRounds,
                            function (err, hashemail) {
                                const to = req.body.email;
                                const html = `Cám ơn bạn đã đăng ký tài khoản <br>  
                                    <a href="http://localhost:3000/user/verify?email=${req.body.email}&token=${hashemail}" target="_blank"> CLick vào đây để xác nhận </a>`;
                                mailer.sendMail(to, html);
                                req.session.save(function (err) {
                                    res.render('login', {
                                        session: req.session,
                                    });
                                });
                            },
                        );
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
                    1,
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
                    if (data[0].authentication == 1) {
                        bcrypt.compare(
                            user_password,
                            data[0].password,
                            function (err, authentic) {
                                console.log(data[0].password);
                                console.log(authentic);
                                if (authentic) {
                                    req.session.user = data[0];
                                    req.session.save(function (err) {
                                        res.render('home', {
                                            session: req.session,
                                        });
                                    });
                                } else {
                                    // req.toastr.error('sai mat khau');
                                    // console.log(req.toastr.render);
                                    // res.render('login', { req: req });
                                    return res.send('Sai mật khẩu');
                                }
                            },
                        );
                    } else {
                        res.send('Chưa xác thực tài khoản');
                    }
                } else {
                    // req.toastr.error('Địa chỉ email không đúng');
                    // res.render('login', { req: req });
                    return res.send('Địa chỉ email không đúng');
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

    //[GET] /user/fogetpass
    fogetpass(req, res) {
        res.render('resetpass');
    }

    //[POST] user/resetpass
    resetpass(req, res) {
        bcrypt.hash(req.body.email, saltRounds, function (err, hash) {
            const to = req.body.email;
            const html = `<a href="http://localhost:3000/user/changepass?email=${to}&token=${hash}"> Click vào đây để đổi mật khẩu </a>`;
            mailer.sendMail(to, html);
            console.log('html: ', html);
        });
        res.send('kiểm tra hòm thư của bạn');
    }

    //[GET] user/changepass
    verify_changepass(req, res) {
        bcrypt.compare(
            req.query.email,
            req.query.token,
            function (err, authentic) {
                if (authentic) {
                    req.session.email = req.query.email;
                    req.session.save(function (err) {
                        res.render('changepass');
                    });
                } else {
                    res.send('Khong thanh cong');
                }
            },
        );
    }
    //[POST] user/changepass
    changepasss(req, res) {
        const changepass = `UPDATE user SET password=? WHERE user.email = '${req.session.email}'`;
        bcrypt.hash(req.body.password1, saltRounds, function (err, hash) {
            if (req.body.password1 == req.body.password2) {
                console.log('pass : ', req.body.password1, req.body.password2);
                console.log('email : ', req.session.email);
                db.query(changepass, hash, function (err, data) {
                    if (data) {
                        res.send('đổi mật khẩu thành công');
                    } else {
                        console.log(err);
                        res.send('đổi mật khẩu không thành công');
                    }
                });
            } else {
                res.send('2 lần nhập mật khẩu không giống nhau');
            }
        });
    }

    //[GET] /user/infor
    infor(req, res) {
        if (req.session.user) {
            var history = `SELECT * FROM user_join_fittness_class 
            Right JOIN fitness_class ON user_join_fittness_class.class_id = fitness_class.class_id
            where user_join_fittness_class.user_id = ?`;
            db.query(
                history,
                req.session.user.user_id,
                function (err, history) {
                    for (let i = 0; i < history.length; i++) {
                        let date = moment
                            .utc(history[i].registration_time)
                            .format('MMM Do, YYYY');
                        history[i].registration_time = date;
                        date = moment
                            .utc(history[i].cancellation_time)
                            .format('MMM Do, YYYY');
                        history[i].cancellation_time = date;
                    }
                    res.render('information', {
                        session: req.session,
                        history,
                    });
                },
            );
        } else {
            res.render('login');
        }
    }
}
module.exports = new UserController();
