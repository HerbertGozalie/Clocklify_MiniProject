const nodemailer = require('nodemailer');

const sendResetPassEmail = async (email, resetToken) => {
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

  const resetUrl = `${process.env.REACT_FRONTEND_URL_DEPLOY}/reset-password?resetToken=${resetToken}`;
  // const resetUrl = `${process.env.REACT_FRONTEND_URL}/reset-password?resetToken=${resetToken}`;

  const mailOptions = {
    from: {
      name:  'Clocklify',
      address: process.env.USER_EMAIL,
    },
    to: email,
    subject: 'Password reset request received',
    text: `We have received a reset password request. please use the below link to reset your password`,
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
          Click this button below for reset password!
        </p>
        <p style="text-align: center;">
          <a 
            href="${resetUrl}" 
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
            Reset Password
          </a>
        </p>
        <p style="color: #555555;">
          If you did not request this, please ignore this email.
        </p>
        <p style="color: #555555;">
          This reset password will be valid for 10 minutes.
        </p>
      </div>
    </body>
    </html>
  `
  }

  try{
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}


module.exports = sendResetPassEmail
