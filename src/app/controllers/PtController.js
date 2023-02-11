const db = require('../../config/db');

class PtController {
    //[GET] /pt
    index(req, res) {
        const search_pt = 'select *from user where role = 2';
        db.query(search_pt, function (err, data) {
            if (data) {
                const search_user = 'select *from user where user_id = ?';
                db.query(
                    search_user,
                    req.session.user_id,
                    function (err, user) {
                        if (user) {
                            res.render('pt', {
                                session: req.session,
                                user: user[0],
                                pt: data,
                            });
                        } else {
                            res.render('pt', {
                                session: req.session,
                                pt: data,
                            });
                        }
                    },
                );
            } else {
                res.sent('Không có huấn luyện viên nào');
            }
        });
    }

    //[GET] /pt/:slug
    show(req, res) {
        const search_user = 'select *from user where user_id = ?';
        db.query(search_user, req.session.user_id, function (err, data) {
            if (data) {
                res.render('ptdetal', { session: req.session, user: data[0] });
            } else {
                res.render('ptdetal', { session: req.session });
            }
        });
    }
}

module.exports = new PtController();
