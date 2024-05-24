import { createTransport } from 'nodemailer';

const sendChangePasswordEmail = async (email, username) => {
    const transporter = createTransport({
        service: 'gmail',
        auth: {
            user: 'cokieenterprise@gmail.com',
            pass: 'fkrm zozi qlau ppzv',
        },
    });

    const mailOptions = {
        from: `"Admin of Cookie" <cokieenterprise@gmail.com>`,
        to: email,
        subject: 'Password Change',
        html: `
            <p>¡Hello! ${username}</p>
            <p>You have just changed your password on your account</p>
            <p>If it wasn't you, please contact us.</p>
            <p>Best regards,</p>
            <p>Admin of Cookie</p>
        `
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

export default sendChangePasswordEmail;
