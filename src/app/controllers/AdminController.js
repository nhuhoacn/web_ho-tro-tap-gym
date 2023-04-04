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
                            if (
                                req.session.user != null &&
                                req.session.user.role == 3
                            ) {
                                var admin = true;
                                req.session.save(function (err) {
                                    res.render('admin_index', {
                                        session: req.session,
                                        value,
                                        admin,
                                    });
                                });
                            } else {
                                res.redirect('/');
                            }
                        });
                    }
                });
            }
        });
    }

    //[GET] /admin/manage_user
    manage_user(req, res, next) {
        if (req.session.user != null && req.session.user.role == 3) {
            var admin = true;
            var all_user = 'select * from user';
            const search_user = `select *from user where name LIKE '%${req.query.search_user}%'`;
            if (req.query.search_user) {
                db.query(search_user, function (err, all_user) {
                    if (!err) {
                        for (let i = 1; i <= all_user.length; i++) {
                            all_user[i - 1].stt = i;
                        }
                        req.session.save(function (err) {
                            res.render('manage_user', {
                                session: req.session,
                                admin,
                                all_user,
                            });
                        });
                    } else {
                        console.log(err);
                    }
                });
            } else {
                db.query(all_user, function (err, all_user) {
                    if (err) {
                        console.log(err);
                    } else {
                        for (let i = 1; i <= all_user.length; i++) {
                            all_user[i - 1].stt = i;
                        }
                        req.session.save(function (err) {
                            res.render('manage_user', {
                                session: req.session,
                                admin,
                                all_user,
                            });
                        });
                    }
                });
            }
        } else {
            res.redirect('/');
        }
    }
    //[GET] /admin/manage_blog
    manage_blog(req, res, next) {
        // if (req.session.user != null && req.session.user.role == 3) {
        var admin = true;
        var all_blog = 'select * from blog';
        const search_blog = `select *from blog where name LIKE '%${req.query.search_blog}%'`;
        if (req.query.search_blog) {
            db.query(search_blog, function (err, all_blog) {
                if (!err) {
                    for (let i = 1; i <= all_blog.length; i++) {
                        all_blog[i - 1].stt = i;
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
            db.query(all_blog, function (err, all_blog) {
                if (err) {
                    console.log(err);
                } else {
                    for (let i = 1; i <= all_blog.length; i++) {
                        all_blog[i - 1].stt = i;
                    }
                    req.session.save(function (err) {
                        res.render('manage_blog', {
                            session: req.session,
                            admin,
                            all_blog,
                        });
                    });
                }
            });
        }
        // } else {
        //     res.redirect('/')
        // }
    }

    //[GET] /admin/manage_class
    manage_class(req, res, next) {
        // if (req.session.user != null && req.session.user.role == 3) {
        var admin = true;
        req.session.save(function (err) {
            res.render('manage_class', {
                session: req.session,
                admin,
            });
        });
        // } else {
        //     res.redirect('/');
        // }
    }
    //[POST] /admin/delete_user
    delete_user(req, res, next) {
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
    }

    //[POST] /admin/block_user
    block_user(req, res, next) {
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
    }

    //[POST] /admin/unblock_user
    unblock_user(req, res, next) {
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
    }
    //[POST] /admin/cancel_admin
    cancel_admin(req, res, next) {
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
    }
    //[POST] /admin/add_admin
    add_admin(req, res, next) {
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
    }
}

module.exports = new AdminController();
