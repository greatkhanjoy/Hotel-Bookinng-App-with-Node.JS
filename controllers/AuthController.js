const User = require('../models/User')
const { CreateJWT, attachCookies } = require('../utill')
const { sendVerificationMail, sendResetPassword } = require('../utill/email')
const crypto = require('crypto')

const login = async (req, res) => {
  const { email, password, name } = req.body
  const user = await User.findOne({ email })
  if (!user) {
    return res.status(400).json({ message: 'invalid credentials!' })
  }
  const isMatch = await user.matchPassword(password)
  if (!isMatch) {
    return res.status(400).json({ message: 'invalid credentials!' })
  }
  if (!user.verified) {
    return res.status(400).json({ message: 'Please verify your email first!' })
  }
  const token = CreateJWT(user)
  attachCookies(res, token)
  res
    .status(200)
    .json({
      message: 'login success!',
      user: {
        token: token,
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
}

const register = async (req, res) => {
  const { name, username, email, password } = req.body
  if (!name || !username || !email || !password) {
    return res
      .status(400)
      .json({ message: 'Name, Username, Email and Password requried' })
  }
  const verificationToken = crypto.randomBytes(40).toString('hex')
  const user = await User.create({
    name,
    email,
    username,
    password,
    verificationToken,
  })
  sendVerificationMail(user.email, user.verificationToken)

  res.status(200).json({ message: 'register success!' })
}

const logout = (req, res) => {
  res.clearCookie('token')
  res.status(200).json({ message: 'logout success!' })
}

const verify = async (req, res) => {
  const { token, email } = req.body
  if (!token || !email) {
    return res.status(400).json({ message: 'Invalid request' })
  }
  const user = await User.findOne({ email })
  if (!user) {
    return res.status(400).json({ message: 'Invalid request!' })
  }
  if (user.verified) {
    return res.status(400).json({ message: 'User already verified!' })
  }
  if (user.verificationToken !== token) {
    return res.status(400).json({ message: 'Invalid request!' })
  }
  user.verified = true
  user.verificationToken = null
  await user.save()
  res.status(200).json({ message: 'Verified!' })
}

const forgotPassword = async (req, res) => {
  const { email } = req.body
  if (!email) {
    return res.status(400).json({ message: 'Email required' })
  }
  const user = await User.findOne({ email })
  if (user) {
    user.resetPasswordToken = crypto.randomBytes(40).toString('hex')
    user.resetPasswordExpires = Date.now() + 3600000 // 1 hour
    await user.save()
    sendResetPassword(user.email, user.resetPasswordToken)
  }
  res.status(200).json({ message: 'Reset password link sent!' })
}

const resetPassword = async (req, res) => {
  const { token, email, password } = req.body
  if (!token || !email || !password) {
    return res.status(400).json({ message: 'Invalid request' })
  }
  const user = await User.findOne({ email: email, resetPasswordToken: token })
  if (!user) {
    return res.status(400).json({ message: 'Invalid request!' })
  }
  if (user.resetPasswordExpires < Date.now()) {
    return res.status(400).json({ message: 'Token expired!' })
  }
  user.password = password
  user.resetPasswordToken = null
  user.resetPasswordExpires = null
  await user.save()
  res.status(200).json({ message: 'Password changed!' })
}
const resetPasswordCheck = async (req, res) => {
  const { token, email } = req.body

  if (!token || !email) {
    return res.status(400).json({ message: 'Invalid request' })
  }
  const user = await User.findOne({ email: email, resetPasswordToken: token })
  if (!user) {
    return res.status(400).json({ message: 'Invalid request!' })
  }
  if (user.resetPasswordExpires < Date.now()) {
    return res.status(400).json({ message: 'Link expired!' })
  }

  res.status(200).json({ message: 'Correct!' })
}

module.exports = {
  login,
  register,
  logout,
  verify,
  forgotPassword,
  resetPassword,
  resetPasswordCheck,
}
