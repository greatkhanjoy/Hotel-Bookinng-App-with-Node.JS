const nodemailer = require('nodemailer')
let sgMail = require('@sendgrid/mail')

const sendResetPassword = async (email, token) => {
  const fakedd = true
  const body = `Please reset your password by clicking on the link below: <a href="${
    process.env.ORIGIN || 'http://localhost:3000'
  }/reset-password?token=${token}&email=${email}" >Reset</a>`

  if (process.env.EMAIL_SENDER === 'nodemailer' || fakedd) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'alexie.fahey82@ethereal.email',
        pass: 'W8fjSeT8tDkRhay3pn',
      },
    })

    const send = await transporter.sendMail({
      from: process.env.APP_NAME || 'Boking App',
      to: email,
      subject: 'Reset your password',
      html: body,
    })

    if (send) {
      console.log('Email sent')
    } else {
      console.log('Email not sent')
    }
  } else if (process.env.EMAIL_SENDER === 'sendgrid') {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
      from: process.env.APP_NAME || 'Boking App',
      to: email,
      subject: 'Reset your password',
      html: body,
    }

    await sgMail.send(msg)
  }
}

module.exports = sendResetPassword
