const Room = require('../models/Room')
const Hotel = require('../models/Hotel')
const {
  validateImageType,
  validateImageSize,
  getImageName,
} = require('../utill')
const path = require('path')

const createRoom = async (req, res) => {
  const { hotelId } = req.body
  const hotel = await Hotel.findById(hotelId)
  if (!hotel) {
    return res.status(404).json({ message: 'Hotel not found' })
  }
  if (req.files) {
    if (process.env.IMAGE_STORAGE === 'cloudinary') {
      const result = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        {
          folder: 'hotel-images',
          use_filename: true,
        }
      )
      req.body.image = result.secure_url
      fs.unlinkSync(req.files.image.tempFilePath)
    } else {
      let productImage = req.files.image
      const imageName = getImageName(productImage)
      const imageType = validateImageType(productImage)
      const imageSize = validateImageSize(productImage, 1000000)
      if (!imageType) {
        return res
          .status(400)
          .json({ msg: 'Image type must be jpeg, png, jpg, or gif! ' })
      }
      if (!imageSize) {
        return res
          .status(400)
          .json({ msg: 'Image size must be less than 1MB! ' })
      }

      const imagePath = path.join(
        __dirname,
        '../public/uploads/' + `${imageName}`
      )
      req.body.image = '/uploads/' + `${imageName}`
      await productImage.mv(imagePath)
    }
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
  if (req.files) {
    if (process.env.IMAGE_STORAGE === 'cloudinary') {
      const result = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        {
          folder: 'hotel-images',
          use_filename: true,
        }
      )
      req.body.image = result.secure_url
      fs.unlinkSync(req.files.image.tempFilePath)
    } else {
      let productImage = req.files.image
      const imageName = getImageName(productImage)
      const imageType = validateImageType(productImage)
      const imageSize = validateImageSize(productImage, 1000000)
      if (!imageType) {
        return res
          .status(400)
          .json({ msg: 'Image type must be jpeg, png, jpg, or gif! ' })
      }
      if (!imageSize) {
        return res
          .status(400)
          .json({ msg: 'Image size must be less than 1MB! ' })
      }

      const imagePath = path.join(
        __dirname,
        '../public/uploads/' + `${imageName}`
      )
      req.body.image = '/uploads/' + `${imageName}`
      await productImage.mv(imagePath)
    }
  }
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

const reserveRoom = async (req, res) => {
  await Room.updateOne(
    { 'roomNumbers._id': req.params.id },
    { $push: { 'roomNumbers.$.unAvailableDates': req.body.dates } }
  )
  res.status(200).json({ message: 'success' })
}

module.exports = {
  createRoom,
  getRooms,
  getSingleRoom,
  updateRoom,
  deleteRoom,
  reserveRoom,
}
