const db = require('../../config/db');
const moment = require('moment');

class AdminController {
    //[GET] /admin
    index(req, res, next) {
        const class_prominent = `SELECT name as class_name,count(*) as so_luong_dk FROM user_join_fitness_class
        left join fitness_class on fitness_class.class_id = user_join_fitness_class.class_id
        GROUP BY class_name ORDER BY so_luong_dk DESC `;
        const sql_join_date = `SELECT join_date,count(*) sl_theongay FROM user_join_fitness_class
        GROUP BY join_date ORDER BY join_date DESC LIMIT 10`;
        const history = `
                    SELECT user.name, fitness_class.name as class_name, fitness_class.class_id,registration_time, cancellation_time, join_date,room_address 
                    FROM user_join_fitness_class LEFT JOIN fitness_class ON user_join_fitness_class.class_id = fitness_class.class_id 
                    LEFT JOIN user on user.user_id = user_join_fitness_class.user_id ORDER BY registration_time DESC`;
        var class_name = [];
        var so_luong_dk = [];
        var join_date = [];
        var sl_theongay = [];
        var admin = true;
        var datenow = moment().format('DD-MM-YYYY');
        //Buổi học nổi bật
        var promise_class_prominent = new Promise((resolve, reject) => {
            db.query(class_prominent, function (err, class_prominent) {
                if (!err) {
                    for (let i of class_prominent) {
                        so_luong_dk.push(i.so_luong_dk);
                        class_name.push(i.class_name);
                    }
                    resolve(class_prominent);
                } else {
                    console.log(err);
                }
            });
        });
        //đếm số lượng học viên them gia theo ngày
        var promise_count_join_date = new Promise((resolve, reject) => {
            db.query(sql_join_date, (err, count_join_date) => {
                if (!err) {
                    for (let i of count_join_date) {
                        var date = moment(i.join_date).format('DD/MM/YYYY');
                        join_date.push(date);
                        sl_theongay.push(i.sl_theongay);
                    }
                    resolve(count_join_date);
                } else {
                    console.log(err);
                }
            });
        });
        var promise_history_class = new Promise((resolve, reject) => {
            db.query(history, function (err, history) {
                if (!err) {
                    for (let i = 0; i < history.length; i++) {
                        let date = moment(history[i].registration_time).format(
                            'kk:mm DD/MM/YYYY',
                        );
                        history[i].registration_time = date;
                        date = moment(history[i].cancellation_time).format(
                            'DD/MM/YYYY',
                        );
                        history[i].cancellation_time = date;
                        date = moment(history[i].join_date).format(
                            'DD/MM/YYYY',
                        );
                        history[i].join_date = date;
                        history[i].status = moment(datenow, 'DD-MM-YYYY').diff(
                            moment(date, 'DD-MM-YYYY'),
                        );
                    }
                    resolve(history);
                } else {
                    console.log(err);
                }
            });
        });
        var admin_index = async () => {
            try {
                await promise_class_prominent;
                await promise_count_join_date;
                var history = await promise_history_class;
                // var count_allclass = await promises_count_allclass;
                var value = {
                    so_luong_dk,
                    class_name,
                    join_date,
                    sl_theongay,
                    history,
                };
                req.session.save(function (err) {
                    res.render('admin_index', {
                        session: req.session,
                        value,
                        admin,
                    });
                });
            } catch (err) {
                console.log(err);
            }
        };
        if (req.session.user && req.session.user.role == 3) {
            admin_index();
        } else {
            res.redirect('/');
        }
    }
    //[GET] /admin/manage_user
    manage_user(req, res, next) {
        var admin = true;
        if (req.query.search_user) {
            var search = req.query.search_user?.trim();
        } else {
            var search = '';
        }
        const all_user = `select *from user where name LIKE '%${search}%'`;
        // đếm số page
        //tìm kiếm user sẽ hiển thị
        var promises_user = new Promise((resolve, reject) => {
            db.query(all_user, function (err, all_user) {
                if (!err) {
                    for (let i = 1; i <= all_user.length; i++) {
                        all_user[i - 1].stt = i;
                    }
                } else {
                    console.log(err);
                }
                resolve(all_user);
            });
        });
        const showuser = async () => {
            try {
                var all_user = await promises_user;
                req.session.save(function (err) {
                    res.render('manage_user', {
                        session: req.session,
                        admin,
                        all_user,
                    });
                });
            } catch (err) {
                console.log(err);
            }
        };
        // if (req.session.user != null && req.session.user.role == 3) {
        showuser();
        // } else {
        //     res.redirect('/')
        // }
    }
    //[GET] /admin/manage_user/page/:page
    manage_user_page(req, res, next) {
        var admin = true;
        var numPerPage = 50;
        if (req.query.search_user) {
            var search = req.query.search_user?.trim();
        } else {
            var search = '';
        }
        const all_user = `select *from user where name LIKE '%${search}%'`;
        const search_user = `select *from user where name LIKE '%${search}%'
        ORDER by user_id DESC LIMIT ? OFFSET ?`;
        // đếm số page
        var promises_num = new Promise((resolve, reject) => {
            db.query(all_user, function (err, all_user) {
                var numPage = Math.ceil(all_user.length / numPerPage);
                resolve(numPage);
            });
        });
        //tìm kiếm user sẽ hiển thị
        var promises_user = new Promise((resolve, reject) => {
            var offset = (req.params.page - 1) * numPerPage;
            db.query(
                search_user,
                [numPerPage, offset],
                function (err, all_user) {
                    if (!err) {
                        for (let i = 1; i <= all_user.length; i++) {
                            all_user[i - 1].stt = i;
                        }
                    } else {
                        console.log(err);
                    }
                    resolve(all_user);
                },
            );
        });
        const showuser = async () => {
            try {
                var numPage = await promises_num;
                var all_user = await promises_user;
                // var offset = (req.params.page - 1) * numPerPage;
                var pagenext = Number(req.params.page) + 1;
                req.session.save(function (err) {
                    res.render('manage_user', {
                        session: req.session,
                        admin,
                        numPage,
                        pagenext,
                        all_user,
                        number_page: req.params.page,
                    });
                });
            } catch (err) {
                console.log(err);
            }
        };
        // if (req.session.user != null && req.session.user.role == 3) {
        showuser();
        // } else {
        //     res.redirect('/')
        // }
    }
    //[GET] /admin/manage_blog
    manage_blog(req, res, next) {
        if (req.session.user != null && req.session.user.role == 3) {
            var admin = true;
            if (req.query.search_blog) {
                var search = req.query.search_blog?.trim();
            } else {
                search = '';
            }
            const search_blog = `select *from blog where name LIKE '%${search}%'`;
            db.query(search_blog, function (err, all_blog) {
                if (!err) {
                    for (let i = 0; i < all_blog.length; i++) {
                        all_blog[i].stt = i + 1;
                        let date = moment().format('MMM Do, YYYY');
                        all_blog[i].date_create_blog = date;
                        if (all_blog[i].author == null) {
                            all_blog[i].author = 'Admin';
                        }
                    }
                    req.session.save(function (err) {
                        res.render('manage_blog', {
                            session: req.session,
                            admin,
                            all_blog,
                        });
                    });
                } else {
                    console.log(err);
                }
            });
        } else {
            res.redirect('/');
        }
    }
    //[GET] /admin/manage_class
    manage_class(req, res, next) {
        if (req.session.user != null && req.session.user.role == 3) {
            var admin = true;
            var now = moment('2023-03-13').format('YYYY-MM-DD');
            var month = moment().format('YYYY-MM');
            const count_join_in_day = `SELECT COUNT(*) count FROM user_join_fitness_class WHERE registration_time LIKE "${now}%";`;
            const count_join_in_month = `SELECT COUNT(*) count FROM user_join_fitness_class WHERE registration_time LIKE "${month}%";`;
            const count_all_class = `SELECT COUNT(*) count FROM fitness_class;`;
            const all_hv = `SELECT COUNT(*) count FROM user_join_fitness_class`;
            if (req.query.search_class) {
                var search = req.query.search_class?.trim();
            } else {
                search = '';
            }
            const all_class = `SELECT class_id,fitness_class.name, start_time, end_time, room_address, maximum, weekday, user.name as trainer
        FROM fitness_class LEFT JOIN user ON user.user_id = fitness_class.trainer_id  where fitness_class.name LIKE '%${search}%'
        ORDER BY weekday`;
            const mysql_count_hv = `SELECT class_id, Count(*) as count FROM user_join_fitness_class WHERE join_date >= ? GROUP BY class_id`;
            const weekdaynow = moment().isoWeekday() + 1;
            var monday = moment()
                .subtract(weekdaynow - 2, 'days')
                .format('DD/MM/YYYY');
            var days = [0, 0, monday];
            //days
            var promise_days = new Promise((resolve, reject) => {
                for (let i = 1; i < 7; i++) {
                    let nextday = moment(days[days.length - 1], 'DD/MM/YYYY')
                        .add(1, 'days')
                        .format('DD/MM/YYYY');
                    days.push(nextday);
                }
                resolve(days);
            });
            // đếm lượt tham gia trong ngày
            var promises_count_day = new Promise((resolve, reject) => {
                db.query(count_join_in_day, function (err, data) {
                    if (!err) {
                        var count_day = data[0].count;
                        resolve(count_day);
                    } else {
                        console.log(err);
                    }
                });
            });
            // đếm lượt tham gia trong tháng
            var promises_count_month = new Promise((resolve, reject) => {
                db.query(count_join_in_month, function (err, data) {
                    if (!err) {
                        var count_day = data[0].count;
                        resolve(count_day);
                    } else {
                        console.log(err);
                    }
                });
            });
            // đếm tổng số lớp trong tuần
            var promises_count_allclass = new Promise((resolve, reject) => {
                db.query(count_all_class, function (err, data) {
                    if (!err) {
                        var count_all_class = data[0].count;
                        resolve(count_all_class);
                    } else {
                        console.log(err);
                    }
                });
            });
            // tất cả lớp học
            var promise_allclass = new Promise((resolve, reject) => {
                db.query(all_class, function (err, all_class) {
                    if (!err) {
                        let day = moment(monday, 'DD/MM/YYYY').format(
                            'YYYY-MM-DD',
                        );
                        db.query(mysql_count_hv, day, function (err, count_hv) {
                            if (!err) {
                                //gán count học viên cho từng lớp
                                for (let j = 0; j < all_class.length; j++) {
                                    if (count_hv.length > 0) {
                                        for (
                                            let i = 0;
                                            i < count_hv.length;
                                            i++
                                        ) {
                                            if (
                                                all_class[j].class_id ==
                                                count_hv[i].class_id
                                            ) {
                                                all_class[j].count_hv =
                                                    count_hv[i].count;
                                            }
                                            if (!all_class[j].count_hv) {
                                                all_class[j].count_hv = 0;
                                            }
                                        }
                                    } else {
                                        all_class[j].count_hv = 0;
                                    }
                                    all_class[j].stt = j + 1;
                                }
                            } else {
                                console.log(err);
                            }
                        });
                        resolve(all_class);
                    } else {
                        console.log(err);
                    }
                });
            });
            //Tất cả học viên
            var promise_all_hv = new Promise((resolve, reject) => {
                db.query(all_hv, (err, all_hv) => {
                    if (!err) {
                        resolve(all_hv[0].count);
                    } else {
                        console.log(err);
                    }
                });
            });
            var statistical_class = async () => {
                try {
                    var count_day = await promises_count_day;
                    var count_month = await promises_count_month;
                    var all_class = await promise_allclass;
                    var count_allclass = await promises_count_allclass;
                    await promise_days;
                    var all_hv = await promise_all_hv;
                    console.log(count_day, count_month);
                    var value = {
                        count_day,
                        count_month,
                        all_class,
                        days,
                        count_allclass,
                        all_hv,
                    };
                    req.session.save(function (err) {
                        res.render('manage_class', {
                            session: req.session,
                            value,
                            admin,
                        });
                    });
                } catch (err) {
                    console.log(err);
                }
            };
            statistical_class();
        } else {
            res.redirect('/');
        }
    }
}

module.exports = new AdminController();
