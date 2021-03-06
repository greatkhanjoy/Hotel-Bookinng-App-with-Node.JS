const express = require('express')
const Router = express.Router()

const {
  loggedin,
  admin,
  authorizedUser,
} = require('../middlewares/Authentication')

const {
  createHotel,
  getHotels,
  getSingleHotel,
  updateHotel,
  deleteHotel,
  searchHotel,
  getCity,
} = require('../controllers/HotelController')

loggedin, Router.route('/').get(getHotels).post(loggedin, admin, createHotel)
Router.route('/search').get(searchHotel)
Router.route('/city').get(getCity)
Router.route('/:id')
  .get(getSingleHotel)
  .put(loggedin, admin, updateHotel)
  .delete(loggedin, admin, deleteHotel)

module.exports = Router
