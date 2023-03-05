const db = require('../../config/db');

class ClassControlller {
    //[GET] class/
    show(req, res) {
        const fitness_class = `SELECT fitness_class.name, price, start_time, end_time, room_address, maximum, user.name as trainer
                        FROM fitness_class right JOIN user ON user.user_id = fitness_class.trainer_id
                        where days_of_the_week = ?`;

        var promises_class_mon = new Promise((resolve, reject) => {
            db.query(fitness_class, 2, function (err, fitness_class_2) {
                if (err) {
                    console.log(err);
                }
                resolve(fitness_class_2);
            });
        });
        var promises_class_tues = new Promise((resolve, reject) => {
            db.query(fitness_class, 3, function (err, fitness_class_3) {
                if (err) {
                    console.log(err);
                }
                resolve(fitness_class_3);
            });
        });
        var promises_class_wed = new Promise((resolve, reject) => {
            db.query(fitness_class, 4, function (err, fitness_class_4) {
                if (err) {
                    console.log(err);
                }
                resolve(fitness_class_4);
            });
        });
        var promises_class_thurs = new Promise((resolve, reject) => {
            db.query(fitness_class, 5, function (err, fitness_class_5) {
                if (err) {
                    console.log(err);
                }
                resolve(fitness_class_5);
            });
        });
        var promises_class_fri = new Promise((resolve, reject) => {
            db.query(fitness_class, 6, function (err, fitness_class_6) {
                if (err) {
                    console.log(err);
                }
                resolve(fitness_class_6);
            });
        });
        var promises_class_sat = new Promise((resolve, reject) => {
            db.query(fitness_class, 7, function (err, fitness_class_7) {
                if (err) {
                    console.log(err);
                }
                resolve(fitness_class_7);
            });
        });
        var promises_class_sun = new Promise((resolve, reject) => {
            db.query(fitness_class, 8, function (err, fitness_class_8) {
                if (err) {
                    console.log(err);
                }
                resolve(fitness_class_8);
            });
        });
        const showclass = async () => {
            try {
                var fitness_class_2 = await promises_class_mon;
                var fitness_class_3 = await promises_class_tues;
                var fitness_class_4 = await promises_class_wed;
                var fitness_class_5 = await promises_class_thurs;
                var fitness_class_6 = await promises_class_fri;
                var fitness_class_7 = await promises_class_sat;
                var fitness_class_8 = await promises_class_sun;
                var value = {
                    fitness_class_2: fitness_class_2,
                    fitness_class_3: fitness_class_3,
                    fitness_class_4: fitness_class_4,
                    fitness_class_5: fitness_class_5,
                    fitness_class_6: fitness_class_6,
                    fitness_class_7: fitness_class_7,
                    fitness_class_8: fitness_class_8,
                };
                res.render('class', {
                    class: value,
                    session: req.session,
                });
            } catch (error) {
                console.log(err);
            }
        };
        showclass();
    }

    //[GET] class/:id
    detail(req, res) {
        res.render('class', { session: req.session });
    }
}

module.exports = new ClassControlller();
