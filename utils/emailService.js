import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  ;

  export const sendVerificationEmail = async (email, verificationCode) => {
    const mailOptions = {
      from: `"Hackathon Platform" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Verification Code - Hackathon Platform',
      html: `
        <h1>Welcome to the Hackathon Platform!</h1>
        <p>Your email verification code is:</p>
        <h2 style="color: #4CAF50;">${verificationCode}</h2>
        <p>Enter this code in the app to verify your account.</p>
      `,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Verification email sent to ${email}`);
    } catch (error) {
      console.error(`Email failed to send: ${error.message}`);
      throw new Error('Failed to send verification email.');
    }
  };
  

  transporter.verify((error, success) => {
    if (error) {
      console.error(`SMTP Connection Error: ${error.message}`);
    } else {
      console.log('SMTP Server is ready to send emails!');
    }
  });
  
