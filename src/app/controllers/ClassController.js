const db = require('../../config/db');
const moment = require('moment');
const { resolve } = require('chart.js/dist/helpers/helpers.options');

class ClassControlller {
    //[GET] class/
    show(req, res) {
        const all_class = `SELECT class_id,fitness_class.name, start_time, end_time, room_address, maximum, weekday, user.name as trainer
                        FROM fitness_class LEFT JOIN user ON user.user_id = fitness_class.trainer_id
                        ORDER BY start_time`;
        const count_hv = `SELECT class_id, Count(*) as count FROM user_join_fittness_class WHERE class_id = ? and join_date >= "?"`;

        db.query(all_class, function (err, all_class) {
            if (err) {
                console.log(err);
            } else {
                const now = moment().format('YYYY-MM-DD');
                if (req.session.user) {
                    for (let i = 0; i < all_class.length; i++) {
                        all_class[i].user_id = Number(req.session.user.user_id);
                    }
                }
                var promises1 = new Promise((resolve, reject) => {
                    for (let i = 0; i < all_class.length; i++) {
                        db.query(
                            count_hv,
                            [all_class[i].class_id, now],
                            function (err, hv) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    all_class[i].count_hv = Number(hv[0].count);
                                    resolve(hv);
                                }
                            },
                        );
                    }
                });
                const function_count_hv = async () => {
                    try {
                        var hv = await promises1;

                        console.log('tong hv ', hv);
                        const weekday = moment().isoWeekday();
                        const monday = moment()
                            .subtract(weekday - 1, 'days')
                            .format('DD/MM/YYYY');
                        const sunday = moment()
                            .add(7 - weekday - 2, 'days')
                            .format('DD/MM/YYYY');
                        var days = [monday];
                        for (let i = 1; i < 7; i++) {
                            let nextday = moment(
                                days[days.length - 1],
                                'DD/MM/YYYY',
                            )
                                .add(1, 'days')
                                .format('DD/MM/YYYY');
                            days.push(nextday);
                        }
                        res.render('class', {
                            session: req.session,
                            user_id: 1,
                            all_class,
                            monday,
                            sunday,
                            days,
                            weekday,
                        });
                    } catch (err) {
                        console.log(err);
                    }
                };
                function_count_hv();
            }
        });
    }

    //[POST] class/
    register_class(req, res) {
        const sql = `SELECT * FROM user_join_fittness_class LEFT JOIN fitness_class 
            ON user_join_fittness_class.class_id = fitness_class.class_id
            WHERE user_id = ?`;
        const insert_table =
            'INSERT INTO user_join_fittness_class(user_id,class_id, registration_time,join_date) VALUES (?)';
        var join = 0;
        var start_time = req.body.start_time;
        var end_time = req.body.end_time;
        var datetime = new Date();
        var weekdaynow = moment().isoWeekday() + 1;
        var weekday = req.body.weekday;
        if (weekdaynow > weekday) {
            var join_date = moment(datetime)
                .add(weekday - weekdaynow + 7, 'days')
                .format('YYYY-MM-DD');
        } else {
            var join_date = moment(datetime)
                .add(weekday - weekdaynow, 'days')
                .format('YYYY-MM-DD');
        }
        db.query(sql, req.session.user.user_id, function (err, class_user) {
            if (class_user) {
                for (let i = 0; i < class_user.length; i++) {
                    var date = moment(class_user[i].join_date).format(
                        'YYYY-MM-DD',
                    );
                    if (
                        class_user[i].class_id == req.body.class_id &&
                        date == join_date
                    ) {
                        join = 1;
                    }
                    if (
                        (date == join_date &&
                            start_time <= class_user[i].start_time &&
                            class_user[i].start_time <= end_time) ||
                        (start_time <= class_user[i].end_time &&
                            class_user[i].end_time <= end_time)
                    ) {
                        join = -1;
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
                        console.log('Đăng ký thành công');
                    }
                });
                res.redirect('/class');
            } else if (join == 1) {
                res.send('Bạn đã đăng ký buổi học này rồi');
                console.log('Bạn đã đăng ký buổi học này rồi');
            } else if (join == -1) {
                res.send('Bạn bị trùng lịch học rồi');
                console.log('Bạn bị trùng lịch học rồi');
            }
        });
    }
}

module.exports = new ClassControlller();
