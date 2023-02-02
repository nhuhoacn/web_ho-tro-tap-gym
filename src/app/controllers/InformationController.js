const { render } = require('ejs');
const db = require('../../config/db');

class InformationControlller {
    //[GET] infor/
    index(req, res) {
        if (req.session.user_id) {
            const search_user = 'select *from user where user_id = ?';
            db.query(search_user, req.session.user_id, function (err, data) {
                if (data) {
                    res.render('information', {
                        session: req.session,
                        user: data[0],
                    });
                } else {
                    res.render('information', { session: req.session });
                }
            });
        } else {
            res.render('login');
        }
    }
}

module.exports = new InformationControlller();
