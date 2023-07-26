const nodemailer = require('nodemailer');
const pug = require('pug');
// eslint-disable-next-line import/no-extraneous-dependencies
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Vu Anh Lam <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid
      return 1;
    }

    /**
     *! the transporter is a service send the email
     */
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  //* this is gonna be method that will do the actual sending
  async send(template, subject) {
    //TODO (1) Render HTML for the email based on the pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );

    //TODO (2) Define email option
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };

    //TODO (3) Create a transport send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the natour family!');
  }
};

// const sendEmail = async (options) => {
//   //TODO (1) Create a transporter
//   /**
//    *! the transporter is a service send the email
//    */
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   //TODO (2) Define the email options
//   const mailOptions = {
//     from: 'Vu Anh Lam <vuanhlam000@gmail.com>',
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//     // html:
//   };

//   //TODO (3) Actually send the email
//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;
