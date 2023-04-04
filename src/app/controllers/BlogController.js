const { render } = require('ejs');
const db = require('../../config/db');
const moment = require('moment');

class BlogControlller {
    //[GET] blog/:page
    index(req, res) {
        var numPerPage = 4;
        const all_blog = 'select *from blog';
        const search_blog =
            'select *from blog order BY blog_id DESC LIMIT ? OFFSET ?';
        const all_topic = `SELECT topic.topic_id,topic.name, COUNT(*) as count FROM topic right JOIN blog ON blog.topic_id = topic.topic_id GROUP BY topic.topic_id`;
        // const sumcomment = 'select count(*) as sumComment from comment where blog_id = ?';

        // đếm số page
        var promises_num = new Promise((resolve, reject) => {
            db.query(all_blog, function (err, all_blog) {
                var numPage = Math.ceil(all_blog.length / numPerPage);
                resolve(numPage);
            });
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
        const showblog = async () => {
            try {
                var numPage = await promises_num;
                var blog = await promises_blog;
                var topic = await promises_all_topic;
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
                });
            } catch (err) {
                console.log(err);
            }
        };
        showblog();
    }
    //[GET] /blog/id/:blog_id
    detail(req, res) {
        const search_blog = `select *from blog  where blog_id= ? `;
        const all_topic = `SELECT topic.topic_id,topic.name, COUNT(*) as count FROM topic right JOIN blog ON blog.topic_id = topic.topic_id GROUP BY topic.topic_id`;
        const search_comment = `SELECT comment.comment_id, comment.description, user.name, user.image, comment.date, comment.id_rep_comment
                        FROM comment LEFT JOIN user ON comment.user_id = user.user_id
                        WHERE blog_id = ?`;

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
                resolve(comment);
            });
        });

        const showdetailblog = async () => {
            try {
                var all_topic = await promises_all_topic;
                var blog_detail = await promises_blog_detail;
                var comment = await promises_comment;
                res.render('detail_blog', {
                    blog: blog_detail[0],
                    topic: all_topic,
                    comment: comment,
                    session: req.session,
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
    //[POST] blog/create
    insert_blog(req, res) {
        const sql =
            'INSERT INTO blog(name,author,image,desciption,topic,date_create_blog) VALUES (?)';
        const values = [
            req.body.blog_name,
            req.body.blog_author,
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
        res.render('create_blog');
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
            'INSERT INTO comment(description,blog_id,user_id) VALUES (?)';
        const values = [
            req.body.comment_new,
            // date.now
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
        res.render('detail_blog');
    }
    //[GET] /blog/change_blog
    change_blog(req, res) {}
    //[POST] blog/change_blog
    save_change(req, res) {}
}

module.exports = new BlogControlller();
