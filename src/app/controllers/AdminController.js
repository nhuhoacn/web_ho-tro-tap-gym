const db = require('../../config/db');

class AdminController {
    //[GET] /admin
    index(req, res, next) {
        var admin = 1;
        res.render('admin_index', { session: req.session, admin });
    }
}

module.exports = new AdminController();
