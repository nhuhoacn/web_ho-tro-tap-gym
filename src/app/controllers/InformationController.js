const { render } = require('ejs');
const db = require('../../config/db');
const moment = require('moment');

class InformationControlller {
    //[GET] /info
    index(req, res) {
        if (req.session.user) {
            var history = `SELECT * FROM user_join_fittness_class 
            Right JOIN fitness_class ON user_join_fittness_class.class_id = fitness_class.class_id
            where user_join_fittness_class.user_id = ?`;
            var bmi =
                Math.round(
                    (req.session.user.weight /
                        (req.session.user.height * req.session.user.height)) *
                        1000000,
                ) / 100;
            db.query(
                history,
                req.session.user.user_id,
                function (err, history) {
                    for (let i = 0; i < history.length; i++) {
                        let date = moment(history[i].registration_time).format(
                            'DD/MM/YYYY',
                        );
                        history[i].registration_time = date;
                        date = moment(history[i].cancellation_time).format(
                            'DD/MM/YYYY',
                        );
                        history[i].cancellation_time = date;
                        date = moment(history[i].join_date).format(
                            'DD/MM/YYYY',
                        );
                        history[i].join_date = date;
                    }
                    let date = moment
                        .utc(req.session.user.birthday)
                        .format('DD/MM/YYYY');
                    req.session.user.birthday = date;
                    res.render('information', {
                        session: req.session,
                        history,
                        bmi,
                    });
                },
            );
        } else {
            res.render('login');
        }
    }
}

module.exports = new InformationControlller();
