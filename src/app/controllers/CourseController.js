const Course = require('../models/Course');
const { mongooseToObject } = require('../../util/mongoose');

class ClassController {
    //[GET] /class/:slug
    show(req, res, next) {
        Course.findOne({ slug: req.params.slug })
            .then((course) => {
                res.render(
                    'detail',
                    { course: mongooseToObject(course) },
                    { session: req.session },
                );
            })
            .catch(next);
    }
    //GET /courses/create
    create(req, res, next) {
        res.render('create', { session: req.session });
    }
    //POST /courses/store
    store(req, res, next) {
        const course = new Course(req.body);
        course
            .save()
            .then(() => res.redirect('/courses/detail'), {
                session: req.session,
            })
            .catch((error) => {});
    }
}

module.exports = new ClassController();
