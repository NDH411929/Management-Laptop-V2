const nodemailer = require("nodemailer");

module.exports.sendMail = (mail, subject, html) => {
    let mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "huyn0634@gmail.com",
            pass: "qsgz agfn fneh epes",
        },
    });

    let mailDetails = {
        from: "huyn0634@gmail.com",
        to: mail,
        subject: subject,
        html: html,
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log("Error Occurs");
        } else {
            console.log("Email sent successfully");
        }
    });
};
