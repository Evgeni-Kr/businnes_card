const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'yourmail@gmail.com',
        pass: 'APP_PASSWORD'
    }
});

async function sendMail(to, subject, text) {
    await transporter.sendMail({
        from: 'Design Studio',
        to,
        subject,
        text
    });
}

module.exports = sendMail;
