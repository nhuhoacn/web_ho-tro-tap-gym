class PtController {
    //[GET] /pt
    index(req, res) {
        res.render('pt');
    }

    //[GET] /pt/:slug
    show(req, res) {
        res.send('ptdetal');
    }
}

module.exports = new PtController();
