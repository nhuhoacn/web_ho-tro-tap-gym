const Student = require('../models/Student');
const { mutipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
const db = require('../../config/db');

class SiteController {
    //[GET] /
    index(req, res, next) {
        Course.find({})
            .then((courses) => {
                res.render('home', {
                    courses: mutipleMongooseToObject(courses),
                });
            })
            .catch(next);
        res.render('home');
    }

    //[GET] /search
    search(req, res) {
        res.render('search');
    }

    //[GET] /register
    register(req, res) {
        res.render('register');
    }

    //[POST] /register
    addUser(req, res, next) {
        const student = new Student(req.body);
        const values = [
            student.name,
            student.birthday,
            student.gender,
            student.height,
            student.weight,
            student.email,
            student.phone_number,
        ];
        const sql =
            'INSERT INTO student(name,birthday,gender,height,weight,email,phone_number) VALUES (?)';
        db.query(sql, [values], function (err, data) {
            if (err) throw err;
            console.log('Student created');
        });
        res.render('home');
    }

    //[GET] /login
    login(req, res) {
        res.render('login');
    }

    //[GET] /resetpass
    resetpass(req, res) {
        res.render('resetpass');
    }
}

module.exports = new SiteController();
