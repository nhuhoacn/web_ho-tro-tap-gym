class ClassControlller {
    //[GET] class/
    show(req, res) {
        res.render('class');
    }

    //[GET] class/:id
    detail(req, res) {
        res.render('class');
    }
}

module.exports = new ClassControlller();
