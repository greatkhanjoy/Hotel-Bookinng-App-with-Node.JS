const Router = require('express').Router()
const { health } = require('../controllers')
const UserRoutes = require('./UserRoutes')
const HotelRoutes = require('./HotelRoutes')
const AuthRoutes = require('./AuthRoutes')
const RoomRoutes = require('./RoomRoutes')

//include routes

//Root Route
Router.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to Hotel Booking App' })
})

//invoke Routes
Router.route('/health').get(health)
Router.use('/api/users', UserRoutes)
Router.use('/api/hotels', HotelRoutes)
Router.use('/api/rooms', RoomRoutes)
Router.use('/api/auth', AuthRoutes)

module.exports = Router
