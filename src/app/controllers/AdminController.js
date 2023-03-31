const db = require('../../config/db');
const moment = require('moment');

class AdminController {
    //[GET] /admin
    index(req, res, next) {
        const class_prominent = `SELECT name as class_name,count(*) as so_luong_dk FROM user_join_fitness_class
        left join fitness_class on fitness_class.class_id = user_join_fitness_class.class_id
        GROUP BY class_name ORDER BY so_luong_dk DESC `;
        const sql_join_date = `SELECT join_date,count(*) sl_theongay FROM user_join_fitness_class
        GROUP BY join_date ORDER BY join_date ASC`;
        var history = `
                    SELECT user.name, fitness_class.name as class_name, fitness_class.class_id,registration_time, cancellation_time, join_date,room_address 
                    FROM user_join_fitness_class LEFT JOIN fitness_class ON user_join_fitness_class.class_id = fitness_class.class_id 
                    LEFT JOIN user on user.user_id = user_join_fitness_class.user_id;`;
        req.session.admin = 1;
        var class_name = [];
        var so_luong_dk = [];
        var join_date = [];
        var sl_theongay = [];
        db.query(class_prominent, function (err, class_prominent) {
            if (err) {
                console.log(err);
            } else {
                db.query(sql_join_date, (err, data) => {
                    if (err) {
                        console.log(err);
                    } else {
                        db.query(history, function (err, history) {
                            for (let i = 0; i < history.length; i++) {
                                let date = moment(
                                    history[i].registration_time,
                                ).format('DD/MM/YYYY');
                                history[i].registration_time = date;
                                date = moment(
                                    history[i].cancellation_time,
                                ).format('DD/MM/YYYY');
                                history[i].cancellation_time = date;
                                date = moment(history[i].join_date).format(
                                    'DD/MM/YYYY',
                                );
                                history[i].join_date = date;
                            }
                            for (let i of data) {
                                var date = moment(i.join_date).format(
                                    'DD/MM/YYYY',
                                );
                                join_date.push(date);
                                sl_theongay.push(i.sl_theongay);
                            }
                            for (let i of class_prominent) {
                                so_luong_dk.push(i.so_luong_dk);
                                class_name.push(i.class_name);
                            }
                            console.log(so_luong_dk);
                            console.log(class_name);
                            console.log(join_date);
                            console.log(sl_theongay);
                            var value = {
                                so_luong_dk: so_luong_dk,
                                class_name: class_name,
                                join_date: join_date,
                                sl_theongay: sl_theongay,
                                history: history,
                            };
                            req.session.save(function (err) {
                                res.render('admin_index', {
                                    session: req.session,
                                    value,
                                });
                            });
                        });
                    }
                });
            }
        });
    }

    manage_user(req, res, next) {
        res.render('manage_user', {
            session: req.session,
        });
    }
    manage_blog(req, res, next) {
        res.render('manage_blog', {
            session: req.session,
        });
    }
    manage_class(req, res, next) {
        res.render('manage_class', {
            session: req.session,
        });
    }
}

module.exports = new AdminController();
