const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //TODO (1) Create a transporter
  /**
   *! the transporter is a service send the email
   */
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //TODO (2) Define the email options
  const mailOptions = {
    from: 'Vu Anh Lam <vuanhlam000@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  //TODO (3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
