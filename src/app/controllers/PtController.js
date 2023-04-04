const db = require('../../config/db');

class PtController {
    //[GET] /pt/page/:page
    index(req, res) {
        var numPerPage = 9;
        var offset = 0;
        const count_pt = 'select count(*)as numPt from user where role = 2';
        const all_pt = 'select *from user where role = 2 LIMIT ? OFFSET ?';
        const search_pt = `select *from user where role = 2 AND name LIKE '%${req.query.search_pt}%'`;

        if (req.query.search_pt) {
            db.query(search_pt, function (err, pt) {
                res.render('pt', {
                    session: req.session,
                    pt: pt,
                });
            });
        } else {
            db.query(count_pt, function (err, rows) {
                if (rows) {
                    var numPage = Math.ceil(rows[0].numPt / numPerPage);
                    offset = (req.params.page - 1) * numPerPage;
                    var i = req.params.page > 3 ? req.params.page - 2 : 1;
                    db.query(all_pt, [numPerPage, offset], function (err, pt) {
                        if (pt) {
                            res.render('pt', {
                                session: req.session,
                                pt: pt,
                                current: req.params.page,
                                numPage: numPage,
                            });
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
    }

    //[GET] /pt/:slug
    show(req, res) {
        res.render('ptdetal', { session: req.session });
    }
}

module.exports = new PtController();
