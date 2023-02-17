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
        // var promises_blog_topic = new Promise((resolve, reject) => {
        //     db.query(blog_topic, req.body.topic_id, function (err, blog) {
        //         resolve(blog);
        //     });
        // });
        const makeblog = async () => {
            try {
                var numPage = await promises_num;
                var blog = await promises_blog;
                var topic = await promises_all_topic;
                var offset = (req.params.page - 1) * numPerPage;
                console.log('số page ', numPage);
                console.log('hiển thị từ hàng thứ : ', offset);
                console.log('topic : ', topic);
                res.render('blog', {
                    session: req.session,
                    blog: blog,
                    topic: topic,
                    numPage: numPage,
                });
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
                res.render('detail_blog', {
                    session: req.session,
                    blog: data[0],
                });
            } else {
                res.sent('id blog chua khoi tao');
            }
        });
    }

    //[GET] blog/create
    create(req, res) {
        res.render('create_blog', {
            session: req.session,
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
        res.render('create_blog', { session: req.session });
    }

    //[GET] /blog/topic/:topic_id
    blog_topic(req, res) {
        const blog_topic = 'select *from blog where topic_id = topic_id';
    }
}

module.exports = new BlogControlller();
