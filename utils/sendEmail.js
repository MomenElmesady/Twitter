const nodemailer = require("nodemailer")

const sendEmail = async options =>{
  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    auth: {
      user: "39a12a6210d430",
      pass: "1692316a0fe12f"
    }
  });
  const mailOptions = {
    from: "Momen@gmail.com",
    to: options.email,
    subject: options.subject,
    html: options.html,
  }
  await transport.sendMail(mailOptions)
}

module.exports = sendEmail

