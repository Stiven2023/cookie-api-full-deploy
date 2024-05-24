import { createTransport } from 'nodemailer';

const sendUpdateStatusEmail = async (email, username, status) => {
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
        subject: 'Account Status Update',
        html: `
            <p>¡Hello! <strong>${username}</strong></p>
            <p>Your account status has been updated to: ${status}</p>
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

export default sendUpdateStatusEmail;
