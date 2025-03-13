const nodemailer = require('nodemailer');
const asyncErrorHandler = require('./asyncErrorHandler');

const sendEmail = asyncErrorHandler(
  async (email, emailToken) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD
      },
    }) 

    const verificationLink = `${process.env.DEPLOY_ENDPOINT}/api/v1/user/verifyemail?emailToken=${emailToken}`;

    const mailOptions = {
      from: `Clocklify <${process.env.USER_EMAIL}>`,
      to: email,
      subject: 'Please verify your email',
      html: 
        `
          <p>Hello, please verify your email by clicking the link below:</p>
          <br>
          <a href="${verificationLink}" target="_blank">Click this link for verification!</a>
          <br>
          <p>If you did not request this, please ignore this email.</p>
        `
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent: ' + info.response);
    return info 
  }
)
module.exports = sendEmail;

/*
  https://enlear.academy/email-verification-with-nodemailer-e8ca35d254c7
  for guidance
*/