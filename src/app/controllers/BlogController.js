class BlogControlller {
    //[GET] blog/
    index(req, res) {
        res.render('blog');
    }
}

module.exports = new BlogControlller();
