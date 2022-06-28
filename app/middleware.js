const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const middlewares = [
  morgan('dev'),
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
  cookieParser(process.env.COOKIE_SECRET || 'secret', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
    signed: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  }),
  express.json(),
  express.urlencoded({ extended: true }),
]

module.exports = middlewares
