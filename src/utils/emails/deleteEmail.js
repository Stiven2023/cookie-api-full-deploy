import { createTransport } from 'nodemailer';

const sendDeleteEmail = async (email, username) => {
    const transporter = createTransport({
        service: 'gmail',
        auth: {
            user: 'cokieenterprise@gmail.com',
            pass: 'fkrm zozi qlau ppzv',
        },
    });

    const mailOptions = {
        from: `"Admin de Cookie" <cokieenterprise@gmail.com>`,
        to: email,
        subject: 'Account Deletion',
        html: `
            <p>¡Hello! <strong>${username}</strong></p>
            <p>Your account has been deleted by the administrators.</p>
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

export default sendDeleteEmail;
