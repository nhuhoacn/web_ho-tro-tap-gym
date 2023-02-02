const ptRouter = require('./pt');
const blogRouter = require('./blog');
const siteRouter = require('./site');
const classRouter = require('./class');
const inforRouter = require('./information');

function router(app) {
    app.use('/blog', blogRouter);
    app.use('/PT', ptRouter);
    app.use('/class', classRouter);
    app.use('/infor', inforRouter);
    app.use('/', siteRouter);
}

module.exports = router;
