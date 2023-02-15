const db = require('../../config/db');

class PtController {
    //[GET] /pt
    index(req, res) {
        var numPerPage = 4;
        var offset = 0;
        const count_pt = 'select count(*)as numPt from user where role = 2';
        const search_pt = 'select *from user where role = 2 LIMIT ? OFFSET ?';
        const search_user = 'select *from user where user_id = ?';
        //đếm có bao nhiêu pt
        db.query(count_pt, function (err, rows) {
            if (rows) {
                var numPage = Math.ceil(rows / numPerPage);
                var offset = (req.params.page - 1) * numPerPage;
                db.query(search_pt, [numPerPage, offset], function (err, pt) {
                    if (pt) {
                        db.query(
                            search_user,
                            req.session.user_id,
                            function (err, user) {
                                if (user) {
                                    res.render('pt', {
                                        session: req.session,
                                        user: user[0],
                                        pt: pt,
                                        numPage: numPage,
                                        pagenext: req.params.page + 1,
                                    });
                                } else {
                                    res.render('pt', {
                                        session: req.session,
                                        pt: pt,
                                        numPage: numPage,
                                        pagenext: req.params.page + 1,
                                    });
                                }
                            },
                        );
                    } else {
                        console.log('error: ', err);
                        result(err, null);
                    }
                });
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
