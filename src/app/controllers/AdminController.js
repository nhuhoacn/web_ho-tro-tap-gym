const db = require('../../config/db');

class AdminController {
    //[GET] /admin
    index(req, res, next) {
        const class_prominent = `SELECT name as class_name,count(*) as so_luong_dk FROM user_join_fitness_class
        left join fitness_class on fitness_class.class_id = user_join_fitness_class.class_id
        GROUP BY fitness_class.class_id ORDER BY so_luong_dk DESC LIMIT 5;`;
        var admin = 1;
        var class_name = [];
        db.query(class_prominent, function (err, class_prominent) {
            var so_luong_dk = [];
            if (err) {
                console.log(err);
            } else {
                for (let i of class_prominent) {
                    so_luong_dk.push(i.so_luong_dk);
                    class_name.push(i.class_name);
                }
                console.log(so_luong_dk);
                console.log(class_name);

                res.render('admin_index', {
                    session: req.session,
                    so_luong_dk,
                    class_name,
                    admin,
                });
            }
        });
    }
}

module.exports = new AdminController();
