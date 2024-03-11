const nodemailer = require("nodemailer")

const sendEmail = async options =>{
  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "3a72951463b985",
      pass: "567f6f4d7f712d"
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