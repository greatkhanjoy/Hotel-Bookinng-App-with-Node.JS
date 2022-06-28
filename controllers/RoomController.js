const Room = require('../models/Room')
const Hotel = require('../models/Hotel')

const createRoom = async (req, res) => {
  const { hotelId } = req.body
  const hotel = await Hotel.findById(hotelId)
  if (!hotel) {
    return res.status(404).json({ message: 'Hotel not found' })
  }
  const room = new Room(req.body)
  const savedRoom = await room.save()
  hotel.rooms.push(savedRoom._id)
  await hotel.save()
  res.status(201).json({ message: 'Room created', savedRoom })
}

const getRooms = async (req, res) => {
  const rooms = await Room.find({})

  res
    .status(200)
    .json({ message: 'success', count: rooms.length, rooms: rooms })
}

const getSingleRoom = async (req, res) => {
  const room = await Room.findById(req.params.id)
  if (!room) {
    return res.status(404).json({ message: 'Room not found' })
  }
  res.status(200).json({ message: 'success', room })
}

const updateRoom = async (req, res) => {
  const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({ message: 'success', room })
}

const deleteRoom = async (req, res) => {
  const room = await Room.findById(req.params.id)
  if (!room) {
    return res.status(404).json({ message: 'Room not found' })
  }
  await room.remove()
  res.status(200).json({ message: 'success' })
}

module.exports = { createRoom, getRooms, getSingleRoom, updateRoom, deleteRoom }
