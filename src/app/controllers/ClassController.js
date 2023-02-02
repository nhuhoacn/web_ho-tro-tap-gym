const db = require('../../config/db');

class ClassControlller {
    //[GET] class/
    show(req, res) {
        const search_user = 'select *from user where user_id = ?';
        db.query(search_user, req.session.user_id, function (err, data) {
            if (data) {
                res.render('class', { session: req.session, user: data[0] });
            } else {
                res.render('class', { session: req.session });
            }
        });
    }

    //[GET] class/:id
    detail(req, res) {
        res.render('class', { session: req.session });
    }
}

module.exports = new ClassControlller();
