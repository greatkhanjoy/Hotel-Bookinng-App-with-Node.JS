const express = require('express')
const Router = express.Router()

const {
  createRoom,
  getRooms,
  getSingleRoom,
  updateRoom,
  deleteRoom,
  reserveRoom,
} = require('../controllers/RoomController')

Router.route('/').get(getRooms).post(createRoom)
Router.route('/:id').get(getSingleRoom).put(updateRoom).delete(deleteRoom)
Router.route('/reserve/:id').put(reserveRoom)

module.exports = Router
