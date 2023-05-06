const { render } = require('ejs');
const db = require('../../config/db');
const moment = require('moment');
var multer = require('multer');
const session = require('express-session');

class InformationControlller {
    //[GET] /info
    index(req, res) {
        if (req.session.user) {
            var history = `SELECT * FROM user_join_fitness_class 
            Right JOIN fitness_class ON user_join_fitness_class.class_id = fitness_class.class_id
            where user_join_fitness_class.user_id = ? order by join_date DESC`;
            var datenow = moment().format('DD-MM-YYYY');
            var timenow_add_30 = moment().add(30, 'minutes').format('kk:mm:ss');
            var bmi =
                Math.round(
                    (req.session.user.weight /
                        (req.session.user.height * req.session.user.height)) *
                        1000000,
                ) / 100;
            db.query(
                history,
                req.session.user.user_id,
                function (err, history) {
                    for (let i = 0; i < history.length; i++) {
                        history[i].timenow_add_30 = timenow_add_30;
                        let date = moment(history[i].registration_time).format(
                            'DD/MM/YYYY',
                        );
                        history[i].registration_time = date;
                        date = moment(
                            history[i].cancellation_time,
                            'YYYY-MM-DD HH:mm:ss',
                        ).format('DD/MM/YYYY HH:mm:ss');
                        history[i].cancellation_time = date;
                        date = moment(
                            history[i].join_date,
                            'YYYY-MM-DD',
                        ).format('DD-MM-YYYY');
                        history[i].join_date = date;
                        history[i].timenow = moment().format('kk:mm:ss');
                        history[i].status = moment(datenow, 'DD-MM-YYYY').diff(
                            moment(date, 'DD-MM-YYYY'),
                        );
                    }
                    res.render('information', {
                        session: req.session,
                        history,
                        bmi,
                    });
                },
            );
        } else {
            res.render('login');
        }
    }

    //[GET] info/change_info
    changeinfo(req, res) {
        if (req.session.user) {
            res.render('change_info', {
                session: req.session,
            });
        } else {
            res.redirect('/user/login');
        }
    }

    //[POST] info/change_info
    savechangeinfo(req, res) {
        var user = req.body;
        user.user_id = req.session.user.user_id;
        var image = req.session.user.image;
        const sql = `UPDATE user SET 
        name="${user.name}", role="${user.role}", birthday="${user.birthday}", gender="${user.gender}", height=${user.height},weight=${user.weight},
        phone_number="${user.phone_number}", address="${user.address}", image=?, fb_link="${user.fb_link}",
        insta_link="${user.insta_link}", yt_link="${user.yt_link}" WHERE user_id = ${user.user_id};`;
        const sql_none_image = `UPDATE user SET 
        name="${user.name}", role="${user.role}", birthday="${user.birthday}", gender="${user.gender}", height=${user.height},weight=${user.weight},
        phone_number="${user.phone_number}", address="${user.address}", fb_link="${user.fb_link}",
        insta_link="${user.insta_link}", yt_link="${user.yt_link}" WHERE user_id = ${user.user_id};`;
        if (req.file && req.session.user) {
            var img_name = req.file.filename;
            db.query(sql, img_name, function (err, data) {
                if (data) {
                    console.log('thay doi thong tin thanh cong');
                    image = img_name;
                    user.image = image;
                    req.session.user = user;
                    res.redirect('/info');
                } else {
                    console.log(err);
                }
            });
        } else if (req.session.user) {
            db.query(sql_none_image, function (err, data) {
                if (data) {
                    console.log('thay doi thong tin thanh cong');
                    user.image = image;
                    req.session.user = user;
                    res.redirect('/info');
                } else {
                    console.log(err);
                }
            });
        } else {
            res.redirect('/user/login');
        }
    }
}

module.exports = new InformationControlller();
