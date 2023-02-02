const db = require('../../config/db');

class BlogControlller {
    //[GET] blog/
    index(req, res) {
        const search_user = 'select *from user where user_id = ?';
        db.query(search_user, req.session.user_id, function (err, data) {
            if (data) {
                res.render('blog', { session: req.session, user: data[0] });
            } else {
                res.render('blog', { session: req.session });
            }
        });
    }
}

module.exports = new BlogControlller();
