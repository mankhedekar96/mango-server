import nodemailer from 'nodemailer'

async function send_otp_to_email(email, otp) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", // your SMTP hostname
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'youremail@gmail.com', // your gmail email address
            pass: 'yourpassword' // your gmail password
        },
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"OTP Verification" <youremail@gmail.com>', // sender address
        to: email, // list of receivers
        subject: 'OTP Verification', // Subject line
        text: `Your OTP is ${otp}`, // plain text body
    };

    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions);

    console.log("OTP sent to %s", email);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

function send_otp_to_phone(phone_number, otp) {
    // Code to send OTP to phone number using a SMS gateway service
}

export default { send_otp_to_email, send_otp_to_phone }