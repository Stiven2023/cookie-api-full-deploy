import { createTransport } from 'nodemailer';

const sendCodeRecoverEmail = async (email, code) => {
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
        subject: 'Password Recovery Code',
        html: `
            <p>¡Hello! ${email}</p>
            <p>Your password recovery code is: ${code}</p>
            <p>If you didn't request this, please ignore this email</p>
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

export default sendCodeRecoverEmail;
