const db = require('../../config/db');
const moment = require('moment');

class ClassControlller {
    //[GET] class/
    show(req, res) {
        const fitness_class = `SELECT class_id,fitness_class.name, start_time, end_time, room_address, maximum,weekday , user.name as trainer
                        FROM fitness_class right JOIN user ON user.user_id = fitness_class.trainer_id
                        where weekday  = ? ORDER BY start_time`;

        var promises_class_mon = new Promise((resolve, reject) => {
            db.query(fitness_class, 2, function (err, fitness_class_2) {
                if (err) {
                    console.log(err);
                }
                resolve(fitness_class_2);
            });
        });
        var promises_class_tues = new Promise((resolve, reject) => {
            db.query(fitness_class, 3, function (err, fitness_class_3) {
                if (err) {
                    console.log(err);
                }
                resolve(fitness_class_3);
            });
        });
        var promises_class_wed = new Promise((resolve, reject) => {
            db.query(fitness_class, 4, function (err, fitness_class_4) {
                if (err) {
                    console.log(err);
                }
                resolve(fitness_class_4);
            });
        });
        var promises_class_thurs = new Promise((resolve, reject) => {
            db.query(fitness_class, 5, function (err, fitness_class_5) {
                if (err) {
                    console.log(err);
                }
                resolve(fitness_class_5);
            });
        });
        var promises_class_fri = new Promise((resolve, reject) => {
            db.query(fitness_class, 6, function (err, fitness_class_6) {
                if (err) {
                    console.log(err);
                }
                resolve(fitness_class_6);
            });
        });
        var promises_class_sat = new Promise((resolve, reject) => {
            db.query(fitness_class, 7, function (err, fitness_class_7) {
                if (err) {
                    console.log(err);
                }
                resolve(fitness_class_7);
            });
        });
        var promises_class_sun = new Promise((resolve, reject) => {
            db.query(fitness_class, 8, function (err, fitness_class_8) {
                if (err) {
                    console.log(err);
                }
                resolve(fitness_class_8);
            });
        });
        const class_all = `SELECT class_id,fitness_class.name, start_time, end_time, room_address, maximum, user.name as trainer
                        FROM fitness_class right JOIN user ON user.user_id = fitness_class.trainer_id
                        ORDER BY start_time`;

        var promises_class_all = new Promise((resolve, reject) => {
            db.query(class_all, function (err, class_all) {
                if (err) {
                    console.log(err);
                }
                resolve(class_all);
            });
        });
        const showclass = async () => {
            try {
                var fitness_class_2 = await promises_class_mon;
                var fitness_class_3 = await promises_class_tues;
                var fitness_class_4 = await promises_class_wed;
                var fitness_class_5 = await promises_class_thurs;
                var fitness_class_6 = await promises_class_fri;
                var fitness_class_7 = await promises_class_sat;
                var fitness_class_8 = await promises_class_sun;
                var class_all = await promises_class_all;
                if (req.session.user) {
                    for (let i = 0; i < fitness_class_2.length; i++) {
                        fitness_class_2[i].user_id = Number(
                            req.session.user.user_id,
                        );
                    }
                    for (let i = 0; i < fitness_class_3.length; i++) {
                        fitness_class_3[i].user_id = Number(
                            req.session.user.user_id,
                        );
                    }
                    for (let i = 0; i < fitness_class_4.length; i++) {
                        fitness_class_4[i].user_id = Number(
                            req.session.user.user_id,
                        );
                    }
                    for (let i = 0; i < fitness_class_5.length; i++) {
                        fitness_class_5[i].user_id = Number(
                            req.session.user.user_id,
                        );
                    }
                    for (let i = 0; i < fitness_class_6.length; i++) {
                        fitness_class_6[i].user_id = Number(
                            req.session.user.user_id,
                        );
                    }
                    for (let i = 0; i < fitness_class_7.length; i++) {
                        fitness_class_7[i].user_id = Number(
                            req.session.user.user_id,
                        );
                    }
                    for (let i = 0; i < fitness_class_8.length; i++) {
                        fitness_class_8[i].user_id = Number(
                            req.session.user.user_id,
                        );
                    }
                }
                var value = {
                    fitness_class_2: fitness_class_2,
                    fitness_class_3: fitness_class_3,
                    fitness_class_4: fitness_class_4,
                    fitness_class_5: fitness_class_5,
                    fitness_class_6: fitness_class_6,
                    fitness_class_7: fitness_class_7,
                    fitness_class_8: fitness_class_8,
                };

                const weekday = moment().isoWeekday() - 1;
                const monday = moment()
                    .subtract(weekday, 'days')
                    .format('DD/MM/YYYY');
                const sunday = moment()
                    .add(7 - weekday - 1, 'days')
                    .format('DD/MM/YYYY');
                var days = [monday];
                console.log(days);
                for (let i = 1; i < 7; i++) {
                    let nextday = moment(days[days.length - 1], 'DD/MM/YYYY')
                        .add(1, 'days')
                        .format('DD/MM/YYYY');
                    days.push(nextday);
                }
                res.render('class', {
                    class: value,
                    session: req.session,
                    user_id: 1,
                    class_all,
                    monday,
                    sunday,
                    days,
                });
            } catch (error) {
                console.log(error);
            }
        };
        showclass();
    }

    //[POST] class/
    register_class(req, res) {
        const mysql =
            'INSERT INTO user_join_fittness_class(user_id,class_id, registration_time,date) VALUES (?)';
        var date = new Date();
        console.log(date);
        const value = [req.session.user.user_id, req.body.fitness_class, date];
        db.query(mysql, [value], function (err, data) {
            if (err) {
                console.log(err);
            } else {
                console.log('Đăng ký thành công');
            }
        });
        res.render('class', { session: req.session });
    }
}

module.exports = new ClassControlller();
