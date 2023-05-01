const db = require('../../config/db');
const moment = require('moment');
const bcrypt = require('bcrypt');

class BlogControlller {
    //[GET] blog/them_anh
    create_image(req, res) {
        res.render('create_image');
    }
    //[POST] blog/them_anh
    async new_image(req, res) {
        console.log(req.file.filename);
        res.send(req.file);
    }
    //[GET] blog/:page
    index(req, res) {
        var numPerPage = 4;
        const all_blog = 'select *from blog';
        const search_blog = `select *, topic.name name_topic from blog left JOIN topic
            ON blog.topic_id = topic.topic_id order BY blog_id DESC LIMIT ? OFFSET ?`;
        const all_topic = `SELECT topic.topic_id,topic.name, COUNT(*) as count FROM topic right JOIN blog ON blog.topic_id = topic.topic_id GROUP BY topic.topic_id`;
        const sql_new_blogs = `SELECT *from blog order BY date_create_blog DESC LIMIT 4 OFFSET 1`;
        const sql_new_blog = `SELECT *from blog order BY date_create_blog DESC LIMIT 1`;

        // đếm số page
        var promises_num = new Promise((resolve, reject) => {
            db.query(all_blog, function (err, all_blog) {
                var numPage = Math.ceil(all_blog.length / numPerPage);
                resolve(numPage);
            });
        });
        var chuoi = 'hoa123';
        bcrypt.hash(chuoi, 10, function (err, hadsh) {
            console.log(hadsh);
        });
        //tìm kiếm blog sẽ hiển thị
        var promises_blog = new Promise((resolve, reject) => {
            var offset = (req.params.page - 1) * numPerPage;
            var date;
            db.query(search_blog, [numPerPage, offset], function (err, blog) {
                for (let i = 0; i < blog.length; i++) {
                    date = moment
                        .utc(blog[i].date_create_blog)
                        .format('MMM Do, YYYY');
                    blog[i].date_create_blog = date;
                    if (blog[i].author == null) {
                        blog[i].author = 'Admin';
                    }
                    blog[i].name_topic = blog[i].name_topic.toLowerCase();
                }
                resolve(blog);
            });
        });

        // đếm xem mỗi loại topic có bao nhiêu bài
        var promises_all_topic = new Promise((resolve, reject) => {
            db.query(all_topic, function (err, all_topic) {
                if (err) {
                    console.log(err);
                }
                resolve(all_topic);
            });
        });
        //new blog
        var promises_new_blog = new Promise((resolve, reject) => {
            db.query(sql_new_blog, function (err, new_blog) {
                if (err) {
                    console.log(err);
                } else {
                    var date = moment(
                        new_blog[0].date_create_blog,
                        'YYYY-MM-DD',
                    ).format('MMM Do, YYYY');
                    new_blog[0].date_create_blog = date;
                    if (new_blog[0].author == null) {
                        new_blog[0].author = 'Admin';
                    }
                }
                resolve(new_blog);
            });
        });
        //new blogs
        var promises_new_blogs = new Promise((resolve, reject) => {
            db.query(sql_new_blogs, function (err, new_blogs) {
                if (err) {
                    console.log(err);
                } else {
                    for (let i = 0; i < new_blogs.length; i++) {
                        var date = moment(new_blogs[i].date_create_blog).format(
                            'MMM Do, YYYY',
                        );
                        new_blogs[i].date_create_blog = date;
                        if (new_blogs[i].author == null) {
                            new_blogs[i].author = 'Admin';
                        }
                    }
                }
                resolve(new_blogs);
            });
        });
        const showblog = async () => {
            try {
                var numPage = await promises_num;
                var blog = await promises_blog;
                var topic = await promises_all_topic;
                var new_blogs = await promises_new_blogs;
                var new_blog = await promises_new_blog;
                var offset = (req.params.page - 1) * numPerPage;
                var pagenext = Number(req.params.page) + 1;
                console.log('số page ', numPage);
                console.log('hiển thị từ hàng thứ : ', offset);
                res.render('blog', {
                    blog: blog,
                    topic: topic,
                    numPage: numPage,
                    pagenext: pagenext,
                    session: req.session,
                    new_blogs,
                    new_blog,
                    number_page: req.params.page,
                });
            } catch (err) {
                console.log(err);
            }
        };
        showblog();
    }
    //[GET] /blog/id/:blog_id
    detail(req, res) {
        const search_blog = `select *, topic.name name_topic from blog RIGHT JOIN topic ON blog.topic_id = topic.topic_id where blog_id= ? `;
        const all_topic = `SELECT topic.topic_id,topic.name, COUNT(*) as count FROM topic right JOIN blog ON blog.topic_id = topic.topic_id GROUP BY topic.topic_id`;
        const search_comment = `SELECT comment.comment_id, comment.description, user.name, user.image, comment.date, comment.id_rep_comment
                        FROM comment LEFT JOIN user ON comment.user_id = user.user_id
                        WHERE blog_id = ?`;
        const sql_new_blogs = `SELECT *from blog order BY date_create_blog DESC LIMIT 4 OFFSET 1`;
        const sql_new_blog = `SELECT *from blog order BY date_create_blog DESC LIMIT 1`;

        // đếm xem mỗi loại topic có bao nhiêu bài
        var promises_all_topic = new Promise((resolve, reject) => {
            db.query(all_topic, function (err, all_topic) {
                if (err) {
                    console.log(err);
                }
                resolve(all_topic);
            });
        });

        //tìm blog_detail
        var promises_blog_detail = new Promise((resolve, reject) => {
            db.query(search_blog, req.params.id, function (err, blog_detail) {
                if (err) {
                    console.log(err);
                }
                resolve(blog_detail);
            });
        });
        // search comment
        var promises_comment = new Promise((resolve, reject) => {
            db.query(search_comment, req.params.id, function (err, comment) {
                if (err) {
                    console.log(err);
                }
                for (let i in comment) {
                    comment[i].date = moment(
                        comment[i].date,
                        'YYYY-MM-DD HH:mm:ss',
                    ).format('lll');
                }
                resolve(comment);
            });
        });
        //new blog
        var promises_new_blog = new Promise((resolve, reject) => {
            db.query(sql_new_blog, function (err, new_blog) {
                if (err) {
                    console.log(err);
                } else {
                    var date = moment(
                        new_blog[0].date_create_blog,
                        'YYYY-MM-DD',
                    ).format('MMM Do, YYYY');
                    new_blog[0].date_create_blog = date;
                    if (new_blog[0].author == null) {
                        new_blog[0].author = 'Admin';
                    }
                }
                resolve(new_blog);
            });
        });
        //new blogs
        var promises_new_blogs = new Promise((resolve, reject) => {
            db.query(sql_new_blogs, function (err, new_blogs) {
                if (err) {
                    console.log(err);
                } else {
                    for (let i = 0; i < new_blogs.length; i++) {
                        var date = moment(new_blogs[i].date_create_blog).format(
                            'MMM Do, YYYY',
                        );
                        new_blogs[i].date_create_blog = date;
                        if (new_blogs[i].author == null) {
                            new_blogs[i].author = 'Admin';
                        }
                    }
                }
                resolve(new_blogs);
            });
        });

        const showdetailblog = async () => {
            try {
                var all_topic = await promises_all_topic;
                var blog_detail = await promises_blog_detail;
                var comment = await promises_comment;
                var new_blogs = await promises_new_blogs;
                var new_blog = await promises_new_blog;
                res.render('detail_blog', {
                    blog: blog_detail[0],
                    topic: all_topic,
                    comment: comment,
                    session: req.session,
                    new_blogs,
                    new_blog,
                });
            } catch (err) {
                console.log(err);
            }
        };
        showdetailblog();
    }

    //[GET] blog/create
    create(req, res) {
        res.render('create_blog');
    }
    // [POST] blog/create
    insert_blog(req, res) {
        const sql =
            'INSERT INTO blog(name,author,image,description,topic,date_create_blog) VALUES (?)';
        const values = [
            req.body.blog_name,
            req.body.blog_author,
            req.body.blog_image,
            req.body.blog_description,
            req.body.blog_topic,
            req.body.blog_date_create,
        ];
        if (
            req.body.blog_name != '' &&
            req.body.blog_author != '' &&
            req.body.blog_image != '' &&
            req.body.blog_description != '' &&
            req.body.blog_topic != '' &&
            req.body.blog_date_create != ''
        ) {
            db.query(sql, [values], function (err, data) {
                if (err) {
                    throw err;
                } else {
                    console.log('blog created');
                }
            });
            res.redirect('/admin/manage_blog');
        } else {
            res.render('create_blog');
        }
    }

    //[GET] /blog/topic/:topic_id
    blog_topic(req, res) {
        var numPerPage = 4;
        var topic_id = Number(req.params.topic);
        const all_blog_topic = 'select *from blog where topic_id = ?';
        const search_blog = `select *from blog  where topic_id= ? LIMIT ? OFFSET ?`;
        const all_topic = `SELECT topic.topic_id,topic.name, COUNT(*) as count FROM topic right JOIN blog ON blog.topic_id = topic.topic_id GROUP BY topic.topic_id`;

        // đếm số page
        var promises_num = new Promise((resolve, reject) => {
            db.query(
                all_blog_topic,
                req.params.topic,
                function (err, all_blog) {
                    var numPage = Math.ceil(all_blog.length / numPerPage);
                    if (err) {
                        console.log(err);
                    }
                    resolve(numPage);
                },
            );
        });
        //tìm kiếm blog sẽ hiển thị
        var promises_blog = new Promise((resolve, reject) => {
            var offset = (req.params.page - 1) * numPerPage;
            db.query(
                search_blog,
                [topic_id, numPerPage, offset],
                function (err, blog) {
                    if (blog) {
                        for (let i = 0; i < blog.length; i++) {
                            let date = moment
                                .utc(blog[i].date_create_blog)
                                .format('MMM Do, YYYY');
                            blog[i].date_create_blog = date;
                            if (blog[i].author == null) {
                                blog[i].author = 'Admin';
                            }
                        }
                    } else {
                        console.log(err);
                    }
                    resolve(blog);
                },
            );
        });

        // đếm xem mỗi loại topic có bao nhiêu bài
        var promises_all_topic = new Promise((resolve, reject) => {
            db.query(all_topic, function (err, all_topic) {
                if (err) {
                    console.log(err);
                }
                resolve(all_topic);
            });
        });
        const showblog = async () => {
            try {
                var numPage = await promises_num;
                var blog = await promises_blog;
                var topic = await promises_all_topic;
                topic[topic_id - 1].active = 1;
                var offset = (req.params.page - 1) * numPerPage;
                var pagenext = Number(req.params.page) + 1;
                console.log('hiển thị từ hàng thứ : ', offset);
                res.render('blog', {
                    blog: blog,
                    topic: topic,
                    page_topic: req.params.topic,
                    numPage: numPage,
                    pagenext: pagenext,
                });
            } catch (err) {
                console.log(err);
            }
        };
        showblog();
    }

    // [POST] /blog/id/:id
    comment_new(req, res) {
        const sql =
            'INSERT INTO comment(description,date,blog_id,user_id) VALUES (?)';
        var date_time = moment().format('YYYY-MM-DD HH:mm:ss');
        const values = [
            req.body.comment_new,
            date_time,
            req.params.id,
            req.session.user.user_id,
        ];
        console.log('values:', values);
        db.query(sql, [values], function (err, data) {
            if (err) {
                throw err;
            } else {
                console.log('comment created');
            }
        });
        res.redirect(`/blog/id/${req.params.id}`);
    }
    //[GET] /blog/change_blog
    change_blog(req, res) {
        if (req.session.user != null && req.session.user.role == 3) {
            var search_blog = `select *from blog where blog_id = ${req.query.blog_id}`;
            if (req.query.blog_id) {
                var now = moment().format();
                db.query(search_blog, function (err, data) {
                    if (!err) {
                        res.render('change_blog', {
                            blog: data[0],
                        });
                    } else {
                        console.log(err);
                    }
                });
            }
        } else {
            res.redirect('/');
        }
    }
    //[POST] blog/change_blog
    save_change(req, res) {
        if (req.session.user != null && req.session.user.role == 3) {
            var blog = req.body;
            var save_blog = `UPDATE blog SET 
        name="${blog.name}", author="${blog.author}", image="${blog.image}", description="${blog.description}",
        topic_id="${blog.topic_id}", date_create_blog="${blog.date_create_blog}" WHERE blog_id = ${blog.blog_id};`;
            db.query(save_blog, function (err, data) {
                if (!err) {
                    console.log(blog.date_create_blog);
                    res.redirect('/admin/manage_blog');
                } else {
                    console.log(err);
                }
            });
        } else {
            res.redirect('/');
        }
    }

    //[POST] /blog/delete_blog
    delete_blog(req, res, next) {
        if (req.session.user != null && req.session.user.role == 3) {
            if (req.body.blog_id) {
                var delete_blog = `DELETE from blog where blog_id = ${req.body.blog_id}`;
                db.query(delete_blog, function (err, data) {
                    if (!err) {
                        res.redirect('/admin/manage_blog');
                    } else {
                        console.log(err);
                    }
                });
            }
        } else {
            res.redirect('/');
        }
    }
}

module.exports = new BlogControlller();
