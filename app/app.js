require('dotenv').config('../.env')
require('express-async-errors')
const express = require('express')
const app = express()

//import modules and files
const middlewares = require('./middleware')
const { notFoundHandler, ErrorHandler } = require('../errors')
const Router = require('../routes')
const connectDB = require('../db/connect')

// invoke middleware
app.use(middlewares)
app.set('trust proxy', 1)

//Invoke Routers
app.use(express.static('public'))
app.use('/', Router)

//invoke after middlewares & handler
app.use(notFoundHandler)
app.use(ErrorHandler)

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI || 'mongodb://localhost/booking')
    // console.log('Connected to MongoDB')
  } catch (error) {
    console.log(error)
  }
}
start()

module.exports = app
