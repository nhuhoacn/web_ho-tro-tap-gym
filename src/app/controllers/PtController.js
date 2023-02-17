const db = require('../../config/db');

class PtController {
    //[GET] /pt/page/:page
    index(req, res) {
        var numPerPage = 24;
        var offset = 0;
        const count_pt = 'select count(*)as numPt from user where role = 2';
        const search_pt = 'select *from user where role = 2 LIMIT ? OFFSET ?';
        //đếm có bao nhiêu pt
        db.query(count_pt, function (err, rows) {
            if (rows) {
                var numPage = Math.ceil(rows[0].numPt / numPerPage);
                offset = (req.params.page - 1) * numPerPage;
                var pagenext = Number(req.params.page) + 1;
                db.query(search_pt, [numPerPage, offset], function (err, pt) {
                    if (pt) {
                        res.render('pt', {
                            session: req.session,
                            pt: pt,
                            numPage: numPage,
                            pagenext: pagenext,
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

    //[GET] /pt/:slug
    show(req, res) {
        res.render('ptdetal', { session: req.session });
    }
}

module.exports = new PtController();
