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

  /*
    untuk html dibawah ini localhost and endpoint refers to frontend web server
  */

  const verificationLink = `${process.env.DEPLOY_ENDPOINT}/api/v1/user/verifyemail?emailToken=${emailToken}`;

  // const mailOptions = {
  //   from: `Clocklify <${process.env.USER_EMAIL}>`,
  //   to: email,
  //   subject: 'Please verify your email',
  //   html: 
  //     `<a href="http://localhost:5173/verify-email?emailToken=${emailToken}">Click here to verify</a>`
  // }


  const mailOptions = {
    from: `Clocklify <${process.env.USER_EMAIL}>`,
    to: email,
    subject: 'Verify your email for Clocklify',
    text: `Welcome to Clocklify! Please verify your email by clicking the link below:\n\n${verificationLink}\n\nIf you did not request this, please ignore this email.`,
    html: `<p>Welcome to Clocklify! Please verify your email by clicking the link below:</p>
        <p><a href="${verificationLink}">${verificationLink}</a></p>
        <p>If you did not request this, please ignore this email.</p>`
  };

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