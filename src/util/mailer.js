require('dotenv').config({ path: __dirname + '/.env' });

const nodeMailer = require('nodemailer');

const sendMail = (to, htmlContent) => {
    // Khởi tạo một thằng transporter object sử dụng chuẩn giao thức truyền tải SMTP với các thông tin cấu hình ở trên.
    const transporter = nodeMailer.createTransport({
        host: process.env.MAILHOST,
        port: process.env.MAILPORT,
        secure: false, // nếu các bạn dùng port 465 (smtps) thì để true, còn lại hãy để false cho tất cả các port khác
        auth: {
            user: process.env.ADMINEMAIL,
            pass: process.env.ADMINPASSWORD,
        },
    });

    const options = {
        from: process.env.ADMINEMAIL, // địa chỉ admin email bạn dùng để gửi
        to: to, // địa chỉ gửi đến
        subject: 'Xác minh địa chỉ email', // Tiêu đề của mail
        html: htmlContent,
    };

    // hàm transporter.sendMail() này sẽ trả về cho chúng ta một Promise
    return transporter.sendMail(options);
};

module.exports = {
    sendMail: sendMail,
};
