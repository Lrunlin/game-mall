const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "qq",
  port: 587,
  secure: false,
  auth: {
    user: `1974109227@qq.com `,
    pass: `xogjwbswikrwfddf`,
  },
});

function sendEmail(params) {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: `1974109227@qq.com `,
      to: params.target,
      subject: params.subject,
      html: params.content,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

module.exports = sendEmail;
