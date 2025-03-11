const nodemailer = require('nodemailer');

const sendEmail = (email, emailToken) => {
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

  const mailOptions = {
    from: `Clocklify <${process.env.USER_EMAIL}>`,
    to: email,
    subject: 'Please verify your email',
    html: 
      `<a href="http://localhost:5173/verify-email?emailToken=${emailToken}">Click here to verify</a>`
  }

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err)
    } else {
      console.log('Email send' + info.response)
    }
  })  
}

module.exports = sendEmail;

/*
  https://enlear.academy/email-verification-with-nodemailer-e8ca35d254c7
  for guidance
*/