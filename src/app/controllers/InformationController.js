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
                    if (req.session.user.birthday) {
                        let date = moment(
                            req.session.user.birthday,
                            'YYYY-MM-DD',
                        ).format('DD/MM/YYYY');
                        req.session.user.birthday = date;
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
        //Nhớ xoá sau khi sửa dữ liệu
        if (req.query.user_id) {
            var doi_tt = `select *from user where user_id = ${req.query.user_id}`;
            db.query(doi_tt, function (err, data) {
                if (!err) {
                    console.log(data);
                    req.session.user = data[0];
                    res.render('change_info', {
                        session: req.session,
                    });
                } else {
                    console.log(err);
                }
            });
        } else {
            res.render('change_info', {
                session: req.session,
            });
        }
    }

    //[POST] info/change_info
    savechangeinfo(req, res) {
        var user = req.body;
        user.user_id = req.session.user.user_id;
        const sql = `UPDATE user SET 
        name="${user.name}", role="${user.role}", birthday="${user.birthday}", gender="${user.gender}", height=${user.height},weight=${user.weight},
        phone_number="${user.phone_number}", address="${user.address}", image="?", fb_link="${user.fb_link}",
        insta_link="${user.insta_link}", yt_link="${user.yt_link}" WHERE user_id = ${user.user_id};`;
        var storage = multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, './public/img');
            },
            filename: function (req, file, callback) {
                var temp_file_arr = file.originalname.split('.');
                var temp_file_name = temp_file_arr[0];
                var temp_file_extension = temp_file_arr[1];
                callback(
                    null,
                    temp_file_name +
                        '-' +
                        Date.now() +
                        '.' +
                        temp_file_extension,
                );
            },
        });

        var upload = multer({ storage: storage }).single('image');

        upload(req, res, function (error) {
            if (error) {
                return res.end('Error Uploading File');
            } else {
                return res.end('File is uploaded successfully');
            }
        });

        // if (file.mimetpe == "image/jpeg" || file.mimetpe == "image/png" || file.mimetpe == "image/gif") {
        //     file.mv("public/images/" + img_name, function (err) {
        //         if (err) {
        //             console.log(err)
        //         } else {
        //             db.query(sql,img_name, function (err, data) {
        //                 if (data) {
        //                     console.log('thay doi thong tin thanh cong');
        //                     req.session.user = user;
        //                     res.render('information', { session: req.session });
        //                 } else {
        //                     console.log(err);
        //                 }
        //             });
        //         }
        //     })
        // }
    }
}

module.exports = new InformationControlller();
