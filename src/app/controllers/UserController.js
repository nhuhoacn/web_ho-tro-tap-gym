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
        if (
            req.body.email != '' &&
            req.body.password != '' &&
            (req.body.role == 1 || req.body.role == 2)
        ) {
            db.query(sql, req.body.email, function (err, data) {
                if (data.length > 0) {
                    res.render('register', {
                        register_false: true,
                    });
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
                                            success: true,
                                        });
                                    });
                                },
                            );
                        },
                    );
                }
            });
        } else {
            res.render('register', {
                mail_or_pass_blank: true,
            });
        }
    }

    //[GET] /user/verify
    verify(req, res) {
        const sql = `INSERT INTO user(name,birthday,gender,height,weight,role,address,
            email,phone_number,image,fb_link,insta_link,yt_link,password,authentication) VALUES (?)`;
        if (
            req.query.email != '' &&
            req.query.token != '' &&
            req.session.user != null
        ) {
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
                                        req.session.user.user_id =
                                            user[0].user_id;
                                        if (
                                            req.session.user.birthday !=
                                            '0000-00-00'
                                        ) {
                                            let date = moment(
                                                req.session.user.birthday,
                                            ).format('YYYY-MM-DD');
                                            req.session.user.birthday = date;
                                        }
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
        } else {
            res.render('login', {
                mail_false: true,
            });
        }
    }

    //[GET] user/login
    login(req, res) {
        res.render('login', { session: req.session });
    }

    //POST user/login
    rememberUser(req, res, next) {
        const user_email = req.body.user_email;
        const user_password = req.body.user_password;
        const sql = 'Select * From user where email = ? ';
        if (user_email && user_password) {
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
                                    if (
                                        req.session.user.birthday !=
                                        '0000-00-00'
                                    ) {
                                        let date = moment(
                                            req.session.user.birthday,
                                        ).format('YYYY-MM-DD');
                                        req.session.user.birthday = date;
                                    }
                                    req.session.signin = true;
                                    if (data[0].role == 3) {
                                        req.session.save(function (err) {
                                            res.redirect('/admin');
                                        });
                                    } else {
                                        req.session.save(function (err) {
                                            res.redirect('/');
                                        });
                                    }
                                } else {
                                    res.render('login', {
                                        pass_false: true,
                                    });
                                }
                            },
                        );
                    } else {
                        res.render('login', {
                            authentic: true,
                        });
                    }
                } else {
                    res.render('login', {
                        user_login: false,
                    });
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
        res.render('fogetpass');
    }

    //[POST] user/fogetpass
    resetpass(req, res) {
        const sql = 'Select * From user where email = ? ';
        if (req.body.email) {
            db.query(sql, req.body.email, function (err, data) {
                if (data.length >= 1) {
                    bcrypt.hash(
                        req.body.email,
                        saltRounds,
                        function (err, hash) {
                            const to = req.body.email;
                            const html = `<a href="http://localhost:3000/user/changepass?email=${to}&token=${hash}"> Click vào đây để đổi mật khẩu </a>`;
                            mailer.sendMail(to, html);
                            console.log('html: ', html);
                        },
                    );
                    res.render('home', {
                        reset_pass: true,
                    });
                } else {
                    res.render('fogetpass', {
                        mail_not_exist: true,
                    });
                }
            });
        } else {
            res.render('fogetpass', {
                mail_false: true,
            });
        }
    }

    //[GET] user/changepass
    verify_changepass(req, res) {
        if (req.query.email != null && req.query.token != null) {
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
        } else {
        }
    }
    //[POST] user/changepass
    changepasss(req, res) {
        if (req.body.password1 != '' && req.body.password2 != '') {
            const changepass = `UPDATE user SET password=? WHERE user.email = '${req.session.email}'`;
            bcrypt.hash(req.body.password1, saltRounds, function (err, hash) {
                if (req.body.password1 == req.body.password2) {
                    console.log(
                        'pass : ',
                        req.body.password1,
                        req.body.password2,
                    );
                    console.log('email : ', req.session.email);
                    db.query(changepass, hash, function (error, data) {
                        if (data) {
                            res.render('login', {
                                changepass: true,
                            });
                        } else {
                            console.log(error);
                            res.send('đổi mật khẩu không thành công');
                        }
                    });
                } else {
                    res.render('fogetpass', {
                        pass_not_match: true,
                    });
                }
            });
        } else {
            res.render('fogetpass', {
                changepass_false: true,
            });
        }
    }

    //[POST] /user/delete_user
    delete_user(req, res, next) {
        if (req.session.user != null && req.session.user.role == 3) {
            if (req.body.user_id) {
                var delete_user = `DELETE from user where user_id = ${req.body.user_id}`;
                db.query(delete_user, function (err, data) {
                    if (!err) {
                        res.redirect('/admin/manage_user');
                    } else {
                        console.log(err);
                    }
                });
            }
        } else {
            res.redirect('/');
        }
    }

    //[POST] /user/block_user
    block_user(req, res, next) {
        if (req.session.user != null && req.session.user.role == 3) {
            if (req.body.user_id) {
                var block_user = `UPDATE user SET authentication = 0 where user_id = ${req.body.user_id}`;
                db.query(block_user, function (err, data) {
                    if (!err) {
                        res.redirect('/admin/manage_user');
                    } else {
                        console.log(err);
                    }
                });
            }
        } else {
            res.redirect('/');
        }
    }

    //[POST] /user/unblock_user
    unblock_user(req, res, next) {
        if (req.session.user != null && req.session.user.role == 3) {
            if (req.body.user_id) {
                var unblock_user = `UPDATE user SET authentication = 1 where user_id = ${req.body.user_id}`;
                db.query(unblock_user, function (err, data) {
                    if (!err) {
                        res.redirect('/admin/manage_user');
                    } else {
                        console.log(err);
                    }
                });
            }
        } else {
            res.redirect('/');
        }
    }
    //[POST] /user/cancel_admin
    cancel_admin(req, res, next) {
        if (req.session.user != null && req.session.user.role == 3) {
            if (req.body.user_id) {
                var cancel_admin = `UPDATE user SET role = 1 where user_id = ${req.body.user_id}`;
                db.query(cancel_admin, function (err, data) {
                    if (!err) {
                        res.redirect('/admin/manage_user');
                    } else {
                        console.log(err);
                    }
                });
            }
        } else {
            res.redirect('/');
        }
    }
    //[POST] /user/add_admin
    add_admin(req, res, next) {
        if (req.session.user != null && req.session.user.role == 3) {
            if (req.body.user_id) {
                var add_admin = `UPDATE user SET role = 3 where user_id = ${req.body.user_id}`;
                db.query(add_admin, function (err, data) {
                    if (!err) {
                        res.redirect('/admin/manage_user');
                    } else {
                        console.log(err);
                    }
                });
            }
        } else {
            res.redirect('/');
        }
    }
}
module.exports = new UserController();
