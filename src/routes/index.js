const ptRouter = require('./pt');
const blogRouter = require('./blog');
const siteRouter = require('./site');
const classRouter = require('./class');
const userRouter = require('./user');
const adminRouter = require('./admin');
const inforRouter = require('./information');

function router(app) {
    app.use('/blog', blogRouter);
    app.use('/PT', ptRouter);
    app.use('/class', classRouter);
    app.use('/user', userRouter);
    app.use('/infor', inforRouter);
    app.use('/admin', adminRouter);
    app.use('/exercises', siteRouter);
    app.use('/', siteRouter);
}

module.exports = router;
