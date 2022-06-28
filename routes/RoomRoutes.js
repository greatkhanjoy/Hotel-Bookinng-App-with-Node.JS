const express = require('express')
const Router = express.Router()

const {
  createRoom,
  getRooms,
  getSingleRoom,
  updateRoom,
  deleteRoom,
} = require('../controllers/RoomController')

Router.route('/').get(getRooms).post(createRoom)
Router.route('/:id').get(getSingleRoom).put(updateRoom).delete(deleteRoom)

module.exports = Router
