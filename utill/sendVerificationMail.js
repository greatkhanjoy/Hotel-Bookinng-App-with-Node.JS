const nodemailer = require('nodemailer')
let sgMail = require('@sendgrid/mail')

const sendVerificationMail = async (email, token) => {
  const body = `Please Verify your email by clicking on the link below: <a href="${
    process.env.ORIGIN || 'http://localhost:5050'
  }/api/auth/verify?token=${token}&email=${email}" >Verify</a>`
  const fakedd = true
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
      subject: 'Verify your email',
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
      subject: 'Verify your email',
      html: body,
    }

    await sgMail.send(msg)
  }
}

module.exports = sendVerificationMail
