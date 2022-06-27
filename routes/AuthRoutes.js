const express = require('express')
const Router = express.Router()

const {
  login,
  register,
  logout,
  verify,
  forgotPassword,
  resetPassword,
} = require('../controllers/AuthController')

Router.post('/login', login)
Router.post('/register', register)
Router.get('/logout', logout)
Router.post('/verify', verify)
Router.post('/forgot-password', forgotPassword)
Router.post('/reset-password', resetPassword)

module.exports = Router
