const nodemailer = require('nodemailer');

exports.sendEmail = async (to, subject, message) => {
    try {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: 'gmail', // Use Gmail service
            auth: {
                user: "la4400512@gmail.com", // your gmail address
                pass: "zsfs dvwg peso xokp", // your app password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Order tracking System" <la4400512@gmail.com>',
            to: to,
            subject: subject,
            text: message,
        });

        console.log(`Email successfully sent to ${to}: ${subject}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};