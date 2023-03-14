const ptRouter = require('./pt');
const blogRouter = require('./blog');
const siteRouter = require('./site');
const classRouter = require('./class');
const userRouter = require('./user');
const infoRouter = require('./info');
const adminRouter = require('./admin');

function router(app) {
    app.use('/blog', blogRouter);
    app.use('/PT', ptRouter);
    app.use('/class', classRouter);
    app.use('/user', userRouter);
    app.use('/info', infoRouter);
    app.use('/admin', adminRouter);
    app.use('/exercises', siteRouter);
    app.use('/', siteRouter);
}

module.exports = router;
