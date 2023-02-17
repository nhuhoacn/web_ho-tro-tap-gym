const db = require('../../config/db');

class ClassControlller {
    //[GET] class/
    show(req, res) {
        res.render('class', { session: req.session });
    }

    //[GET] class/:id
    detail(req, res) {
        res.render('class', { session: req.session });
    }
}

module.exports = new ClassControlller();
