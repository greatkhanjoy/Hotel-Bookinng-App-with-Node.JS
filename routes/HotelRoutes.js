const express = require('express')
const Router = express.Router()

const {
  createHotel,
  getHotels,
  getSingleHotel,
  updateHotel,
  deleteHotel,
} = require('../controllers/HotelController')

Router.route('/').get(getHotels).post(createHotel)
Router.route('/:id').get(getSingleHotel).put(updateHotel).delete(deleteHotel)

module.exports = Router
