import { createTransport } from 'nodemailer';

const sendSignInEmail = async (email, username) => {
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
        subject: 'Sign In Alert',
        html: `
            <p>¡Hello! ${username}</p>
            <p>A sign in has been detected on your account recently</p>
            <p>If it wasn't you, please change your password immediately</p>
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

export default sendSignInEmail;
