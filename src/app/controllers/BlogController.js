const { render } = require('ejs');
const db = require('../../config/db');

class BlogControlller {
    //[GET] blog/:page
    index(req, res) {
        var numPerPage = 2;
        var offset = 0;
        const count_blog = 'select count(*) as numRows from blog';
        const search_blog = 'select *from blog LIMIT ? OFFSET ?';
        const search_user = 'select *from user where user_id = ?';
        //đếm có bao nhiêu hàng, tính số Page
        db.query(count_blog, function (err, rows) {
            if (err) {
                console.log('error: ', err);
                result(err, null);
            } else {
                var numPage = Math.ceil(rows[0].numRows / numPerPage);
                var offset = (req.params.page - 1) * numPerPage;
                db.query(
                    search_blog,
                    [numPerPage, offset],
                    function (err, blog) {
                        if (err) {
                            console.log('error: ', err);
                            result(err, null);
                        } else {
                            db.query(
                                search_user,
                                req.session.user_id,
                                function (err, user) {
                                    if (user) {
                                        res.render('blog', {
                                            session: req.session,
                                            user: user[0],
                                            blog: blog,
                                            numPage: numPage,
                                        });
                                    } else {
                                        res.render('blog', {
                                            session: req.session,
                                            blog: blog,
                                            numPage: numPage,
                                        });
                                    }
                                },
                            );
                        }
                    },
                );
            }
        });

        // var promises1 = new Promise((resolve, reject) => {
        //     db.query(count_blog, function (err, rows) {
        //         var numPage = Math.ceil(data[0].numRows / numPerPage)
        //         offset = (req.params.page - 1) * numPerPage
        //         console.log("hiển thị từ hàng thứ : ", offset)
        //         var values = [rows, numPage]
        //         resolve(values)
        //     })
        // })
        // var promises2 = new Promise((resolve, reject) => {
        //     db.query(search_blog, [numPerPage, offset], function (err, blog) {
        //         var blog = data
        //         resolve(blog)
        //     })
        // })
        // var promises3 = new Promise((resolve, reject) => {
        //     db.query(search_user, req.session.user_id, function (err, user) {
        //         if (data) {
        //             res.render("blog", { session: req.session, user: data[0], blog: blog, numPage });
        //         } else {
        //             res.render("blog", { session: req.session, blog: blog, numPage });
        //         }
        //         resolve(user)
        //     })
        // })

        // promises1.then((data) => {
        //     console.log(data.rows)
        //     console.log(data.numPage)
        //     return promises2
        // })
        //     .then((data) => {
        //         console.log("blog : ", data)

        //         return promises3
        //     })
        //     .then((data) => {
        //         console.log("user: ", data)

        //     })
        //     .catch((err) => {
        //         console.log(err)
        //     })
    }
    //[GET] /blog/:slug
    show(req, res) {
        const search_blog = 'select *from blog where blog_id = ?';
        db.query(search_blog, req.params.id, function (err, data) {
            if (data) {
                const search_user = 'select *from user where user_id = ?';
                db.query(
                    search_user,
                    req.session.user_id,
                    function (err, user) {
                        if (user) {
                            res.render('detail_blog', {
                                session: req.session,
                                user: user[0],
                                blog: data[0],
                            });
                        } else {
                            res.render('detail_blog', {
                                session: req.session,
                                blog: data[0],
                            });
                        }
                    },
                );
            } else {
                res.sent('id blog chua khoi tao');
            }
        });
    }

    //[GET] blog/create
    create(req, res) {
        const search_user = 'select *from user where user_id = ?';
        db.query(search_user, req.session.user_id, function (err, data) {
            if (data) {
                res.render('create_blog', {
                    session: req.session,
                    user: data[0],
                });
            } else {
                res.render('create_blog', { session: req.session });
            }
        });
    }
    //[POST] blog/create
    insert_blog(req, res) {
        const sql =
            'INSERT INTO blog(name,image,desciption,topic,date_create) VALUES (?)';
        const values = [
            req.body.blog_name,
            req.body.blog_image,
            req.body.blog_desciption,
            req.body.blog_topic,
            req.body.blog_date_create,
        ];
        db.query(sql, [values], function (err, data) {
            if (err) {
                throw err;
            } else {
                console.log('blog created');
            }
        });

        const search_user = 'select *from user where user_id = ?';
        db.query(search_user, req.session.user_id, function (err, data) {
            if (data) {
                res.render('create_blog', {
                    session: req.session,
                    user: data[0],
                });
            } else {
                res.render('create_blog', { session: req.session });
            }
        });
    }
}

module.exports = new BlogControlller();
