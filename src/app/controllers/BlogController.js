const { render } = require('ejs');
const db = require('../../config/db');

class BlogControlller {
    //[GET] blog/:page
    index(req, res) {
        var numPerPage = 4;
        const all_blog = 'select *from blog';
        const search_blog = 'select *from blog LIMIT ? OFFSET ?';
        const search_user = 'select *from user where user_id = ?';

        // đếm số page
        var promises1 = new Promise((resolve, reject) => {
            db.query(all_blog, function (err, all_blog) {
                var numPage = Math.ceil(all_blog.length / numPerPage);
                resolve(numPage);
            });
            return promises1;
        });
        //tìm kiếm blog sẽ hiển thị
        var promises2 = new Promise((resolve, reject) => {
            var offset = (req.params.page - 1) * numPerPage;
            db.query(search_blog, [numPerPage, offset], function (err, blog) {
                resolve(blog);
            });
        });
        //ktra user đăng nhập chưa
        var promises3 = new Promise((resolve, reject) => {
            db.query(search_user, req.session.user_id, function (err, user) {
                resolve(user);
            });
        });
        const makeblog = async () => {
            try {
                var numPage = await promises1;
                var blog = await promises2;
                var user = await promises3;
                var offset = (req.params.page - 1) * numPerPage;
                console.log('số page ', numPage);
                console.log('hiển thị từ hàng thứ : ', offset);
                console.log('promises3: ', user);
                if (user) {
                    return res.render('blog', {
                        session: req.session,
                        user: user[0],
                        blog: blog,
                        numPage: numPage,
                    });
                } else {
                    return res.render('blog', {
                        session: req.session,
                        blog: blog,
                        numPage: numPage,
                    });
                }
            } catch (err) {
                console.log(err);
            }
        };
        makeblog();
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
