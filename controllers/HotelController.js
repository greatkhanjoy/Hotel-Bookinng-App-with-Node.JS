const Hotel = require('../models/Hotel')

const createHotel = async (req, res) => {
  const hotel = await Hotel.create(req.body)
  res.status(201).json({ message: 'Hotel created successfully', hotel })
}

const getHotels = async (req, res) => {
  const hotels = await Hotel.find()
  res.status(200).json({ message: 'Success', count: hotels.length, hotels })
}

const getSingleHotel = async (req, res) => {
  const hotel = await Hotel.findById(req.params.id)
  if (!hotel) {
    return res.status(404).json({ message: 'Hotel not found' })
  }
  res.status(200).json({ message: 'Success', hotel })
}

const updateHotel = async (req, res) => {
  const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!hotel) {
    return res.status(404).json({ message: 'Hotel not found' })
  }
  res.status(200).json({ message: 'Success', hotel })
}

const deleteHotel = async (req, res) => {
  const hotel = await Hotel.findByIdAndDelete(req.params.id)
  if (!hotel) {
    return res.status(404).json({ message: 'Hotel not found' })
  }
  res.status(200).json({ message: 'Success', hotel })
}

module.exports = {
  createHotel,
  getHotels,
  getSingleHotel,
  updateHotel,
  deleteHotel,
}
