const nodemailer = require('nodemailer')
let sgMail = require('@sendgrid/mail')

const sendEmail = async (email, subject, text) => {
  if (process.env.EMAIL_SENDER === 'nodemailer') {
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'alexie.fahey82@ethereal.email',
        pass: 'W8fjSeT8tDkRhay3pn',
      },
    })

    const send = await transporter.sendMail({
      from: process.env.APP_NAME + '<' + process.env.EMAIL_SENDER_USER + '>',
      to: email,
      subject: subject,
      html: text,
    })

    if (send) {
      console.log('Email sent')
    } else {
      console.log('Email not sent')
    }
  } else if (process.env.EMAIL_SENDER === 'sendgrid') {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
      from: process.env.APP_NAME + '<' + process.env.EMAIL_SENDER_USER + '>',
      to: email,
      subject: subject,
      html: text,
    }

    await sgMail.send(msg)
  }
}

module.exports = { sendEmail }
