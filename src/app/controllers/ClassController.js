const db = require('../../config/db');
const moment = require('moment');

class ClassControlller {
    //[GET] class/
    show(req, res) {
        const all_class = `SELECT class_id,fitness_class.name, start_time, end_time, room_address, maximum, weekday, user.name as trainer
                        FROM fitness_class LEFT JOIN user ON user.user_id = fitness_class.trainer_id
                        ORDER BY start_time`;
        const mysql_count_hv = `SELECT class_id, Count(*) as count FROM user_join_fitness_class WHERE join_date >= ? GROUP BY class_id`;
        const weekdaynow = moment().isoWeekday() + 1;
        var monday = moment()
            .subtract(weekdaynow - 2, 'days')
            .format('DD/MM/YYYY');
        var days = [0, 0, monday];
        var promise_allclass = new Promise((resolve, reject) => {
            db.query(all_class, function (err, all_class) {
                if (err) {
                    console.log(err);
                } else {
                    resolve(all_class);
                }
            });
        });
        var promise_search_count = new Promise((resolve, reject) => {
            let day = moment()
                .subtract(weekdaynow - 2, 'days')
                .format('YYYY/MM/DD');
            db.query(mysql_count_hv, day, function (err, hv) {
                if (err) {
                    console.log(err);
                } else {
                    resolve(hv);
                }
            });
        });

        const function_count_hv = async () => {
            try {
                var all_class = await promise_allclass;
                var count_hv = await promise_search_count;
                if (req.session.user) {
                    for (let i = 0; i < all_class.length; i++) {
                        all_class[i].user_id = req.session.user.user_id;
                        all_class[i].weekdaynow = weekdaynow;
                    }
                }
                for (let j = 0; j < all_class.length; j++) {
                    for (let i = 0; i < count_hv.length; i++) {
                        if (all_class[j].class_id == count_hv[i].class_id) {
                            all_class[j].count_hv = count_hv[i].count;
                        }
                        if (!all_class[j].count_hv) {
                            all_class[j].count_hv = 0;
                        }
                    }
                }
                for (let i = 1; i < 7; i++) {
                    let nextday = moment(days[days.length - 1], 'DD/MM/YYYY')
                        .add(1, 'days')
                        .format('DD/MM/YYYY');
                    days.push(nextday);
                }
                res.render('class', {
                    session: req.session,
                    user_id: 1,
                    all_class,
                    days,
                    weekdaynow,
                });
            } catch (err) {
                console.log(err);
            }
        };
        function_count_hv();
    }

    //[POST] class/
    register_class(req, res) {
        const sql = `SELECT * FROM user_join_fitness_class LEFT JOIN fitness_class 
            ON user_join_fitness_class.class_id = fitness_class.class_id
            WHERE user_id = ?`;
        const all_class = 'SELECT * FROM `fitness_class`';
        const insert_table =
            'INSERT INTO user_join_fitness_class(user_id,class_id, registration_time,join_date) VALUES (?)';
        var start_time = req.body.start_time;
        var end_time = req.body.end_time;
        var datetime = new Date();
        var weekdaynow = moment().isoWeekday() + 1;
        var weekday = req.body.weekday;
        var timenow_add_30 = moment().add(30, 'minutes').format('kk:mm:ss');

        //ngày sẽ tham gia lớp học
        if (weekdaynow > weekday) {
            var join_date = moment(datetime)
                .add(weekday - weekdaynow + 7, 'days')
                .format('YYYY-MM-DD');
        } else {
            var join_date = moment(datetime)
                .add(weekday - weekdaynow, 'days')
                .format('YYYY-MM-DD');
        }
        if (weekday == weekdaynow && timenow_add_30 >= start_time) {
            var join = 3;
        } else if (req.body.count_hv == req.body.maximum) {
            var join = 4;
        } else {
            var join = 0;
        }
        db.query(sql, req.session.user.user_id, function (err, class_user) {
            if (class_user) {
                for (let i = 0; i < class_user.length; i++) {
                    var date = moment(class_user[i].join_date).format(
                        'YYYY-MM-DD',
                    );
                    // kiểm tra đã đăng ký tham gia lớp học chưa
                    if (
                        class_user[i].class_id == req.body.class_id &&
                        date == join_date
                    ) {
                        join = 1;
                    } else if (
                        date == join_date &&
                        ((start_time <= class_user[i].start_time &&
                            class_user[i].start_time <= end_time) ||
                            (start_time <= class_user[i].end_time &&
                                class_user[i].end_time <= end_time))
                    ) {
                        join = 2;
                    }

                    if (date == join_date) {
                        console.log(date);

                        console.log('Ngày tham gia buổi học:', date, join_date);
                        console.log(
                            'giờ bắt đầu và kết thúc:',
                            start_time,
                            class_user[i].start_time,
                            ':',
                            end_time,
                            class_user[i].end_time,
                        );
                    }
                }
            }
            if (join == 0) {
                const value = [
                    req.session.user.user_id,
                    req.body.class_id,
                    datetime,
                    join_date,
                ];
                db.query(insert_table, [value], function (err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Đăng ký tham gia thành công');
                    }
                });

                res.redirect('/class');
            } else if (join == 1) {
                res.send('Bạn đã đăng ký tham gia buổi học này rồi');
                console.log('Bạn đã đăng ký tham gia buổi học này rồi');
            } else if (join == 2) {
                res.send('Bạn bị trùng lịch rồi');
                console.log('Bạn bị trùng lịch rồi');
            } else if (join == 3) {
                res.send('Hãy đăng ký tham gia 30p trước buổi học');
                console.log('Hãy đăng ký tham gia 30p trước buổi học');
            } else if (join == 4) {
                res.send('Đã đầy học viên');
                console.log('Đã đầy học viên');
            }
        });
    }

    //[POSt] /info/cancel_class/:class_id
    cancel_class(req, res) {
        var now = moment().format('YYYY-MM-DD HH:mm:ss');
        var join_date = moment(req.body.join_date, 'DD-MM-YYYY').format(
            'YYYY-MM-DD',
        );
        console.log(now, join_date);
        const sql = `UPDATE user_join_fitness_class SET cancellation_time= '${now}'
        where class_id = ${req.body.class_id} and join_date= '${join_date}' and user_id=${req.session.user.user_id}`;
        var timenow_add_30 = moment().add(30, 'minutes').format('kk:mm:ss');
        var datenow = moment().format('DD-MM-YYYY');
        if (
            req.body.join_date < datenow ||
            (req.body.join_date == datenow && timenow_add_30 >= start_time)
        ) {
            res.send(
                'Không thể huỷ buổi học vì buổi học đã diễn ra hoặc còn dưới 30p nữa buổi học sẽ diễn ra',
            );
        } else {
            db.query(sql, function (err, data) {
                if (data) {
                    res.redirect('/info');
                } else {
                    console.log(err);
                }
            });
        }
    }
}

module.exports = new ClassControlller();
