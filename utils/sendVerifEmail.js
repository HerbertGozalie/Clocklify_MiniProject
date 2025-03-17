const nodemailer = require('nodemailer');

const sendVerifEmail = async (email, emailToken) => {
  const transporter = nodemailer.createTransport({
    service: process.env.VERIF_SERVICE,
    host: process.env.VERIF_HOST,
    port: process.env.VERIF_PORT,
    secure: false,
    auth: {
      user: process.env.VERIF_USER_EMAIL,
      pass: process.env.VERIF_USER_PASSWORD
    },
  }) 
    
  const verificationUrl = `${process.env.REACT_FRONTEND_URL}/verify-email?emailToken=${emailToken}`;

  const mailOptions = {
    from: {
      name:  'Clocklify',
      address: process.env.USER_EMAIL,
    },
    to: email,
    subject: 'Please verify your email',
    text: 'Hello, please verify your email by clicking the link below:',
    html: 
      `<!DOCTYPE html>
    <html>
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>Verify Your Email</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 30px auto; background: #ffffff; padding: 20px; border-radius: 4px; text-align: center;">
        <h2 style="color: #333333;">Please Verify Your Email</h2>
        <p style="color: #555555;">
          Hello, please verify your email by clicking the button below:
        </p>
        <p style="text-align: center;">
          <a 
            href="${verificationUrl}" 
            style="
              display: inline-block;
              padding: 12px 24px;
              margin: 10px 0;
              color: #ffffff;
              background-color: #007BFF;
              text-decoration: none;
              border-radius: 4px;
            "
            target="_blank"
          >
            Verify Email
          </a>
        </p>
        <p style="color: #555555;">
          If you did not request this, please ignore this email.
        </p>
      </div>
    </body>
    </html>
  `
  }

  try{
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch(err){
    console.error('Error sending email:', error); 
  }
}

module.exports = sendVerifEmail

/*
  https://enlear.academy/email-verification-with-nodemailer-e8ca35d254c7
  for guidance
*/