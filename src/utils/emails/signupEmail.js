import { createTransport } from 'nodemailer';

const sendRegistrationEmail = async (email, username) => {
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
        subject: 'Welcome to Cookie!',
        html: `
            <p>¡Hello <strong>${username}</strong>!</p>
            <p>Thank you for registering with our Cookie app!</p>
            <p>We are delighted to have you as part of our community.</p>
            <p>Here are some tips to get started:</p>
            <ul>
                <li>Complete your profile with a photo and a brief biography.</li>
                <li>Explore the posts of other users and follow those that interest you.</li>
                <li>Start posting content and share your ideas with the world!</li>
            </ul>
            <p>If you have any questions or need help, please feel free to contact us.</p>
            <p>Enjoy your experience on Cookie!</p>
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

export default sendRegistrationEmail;
