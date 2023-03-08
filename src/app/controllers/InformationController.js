const { render } = require('ejs');
const db = require('../../config/db');

class InformationControlller {
    //[GET] infor/
    index(req, res) {
        if (req.session.user_id) {
            res.render('information', { session: req.session });
        } else {
            res.render('login');
        }
    }
}

module.exports = new InformationControlller();
