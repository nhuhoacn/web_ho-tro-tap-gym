const { render } = require('ejs');
const db = require('../../config/db');

class BlogControlller {
    //[GET] blog/:page
    index(req, res) {
        var numPerPage = 4;
        const all_blog = 'select *from blog';
        const search_blog = 'select *from blog LIMIT ? OFFSET ?';
        const all_topic = `SELECT topic.topic_id,topic.name, COUNT(*) as count FROM topic right JOIN blog ON blog.topic_id = topic.topic_id GROUP BY topic.topic_id`;

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
            db.query(search_blog, [numPerPage, offset], function (err, blog) {
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
                console.log('topic : ', topic);
                res.render('blog', {
                    blog: blog,
                    topic: topic,
                    numPage: numPage,
                    pagenext: pagenext,
                });
            } catch (err) {
                console.log(err);
            }
        };
        showblog();
    }
    //[GET] /blog/:slug
    show(req, res) {
        const search_blog = 'select *from blog where blog_id = ?';
        db.query(search_blog, req.params.id, function (err, data) {
            if (data) {
                res.render('detail_blog', {
                    blog: data[0],
                });
            } else {
                res.sent('id blog chua khoi tao');
            }
        });
    }

    //[GET] blog/create
    create(req, res) {
        res.render('create_blog');
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
        res.render('create_blog');
    }

    //[GET] /blog/topic/:topic_id
    blog_topic(req, res) {
        var numPerPage = 4;
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
            var topic_id = Number(req.params.topic);
            db.query(
                search_blog,
                [topic_id, numPerPage, offset],
                function (err, blog) {
                    if (err) {
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
                var offset = (req.params.page - 1) * numPerPage;
                var pagenext = Number(req.params.page) + 1;
                console.log('số page ', numPage);
                console.log('hiển thị từ hàng thứ : ', offset);
                console.log('topic : ', req.params.page);
                console.log('blog : ', blog);
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
}

module.exports = new BlogControlller();
