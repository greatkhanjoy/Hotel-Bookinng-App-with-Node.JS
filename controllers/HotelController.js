const Hotel = require('../models/Hotel')
const Room = require('../models/Room')
const {
  validateImageType,
  validateImageSize,
  getImageName,
} = require('../utill')
const path = require('path')

const createHotel = async (req, res) => {
  if (req.files) {
    if (process.env.IMAGE_STORAGE === 'cloudinary') {
      const result = await cloudinary.uploader.upload(
        req.files.featuredImage.tempFilePath,
        {
          folder: 'hotel-images',
          use_filename: true,
        }
      )
      req.body.featuredImage = result.secure_url
      fs.unlinkSync(req.files.image.tempFilePath)
    } else {
      let productImage = req.files.featuredImage
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
      req.body.featuredImage = '/uploads/' + `${imageName}`
      await productImage.mv(imagePath)
    }
  }

  const hotel = await Hotel.create(req.body)
  // if (req.files) {
  //   hotel.photos.push(req.body.image)
  //   await hotel.save()
  // }
  res.status(201).json({ message: 'Hotel created successfully', hotel })
}

const getHotels = async (req, res) => {
  const hotels = await Hotel.find()
  res
    .status(200)
    .json({ message: 'Success', count: hotels.length, items: hotels })
}

const getSingleHotel = async (req, res) => {
  const hotel = await Hotel.findById(req.params.id)
  if (!hotel) {
    return res.status(404).json({ message: 'Hotel not found' })
  }
  const list = await Promise.all(
    hotel.rooms.map((room) => {
      return Room.findById(room)
    })
  )

  res.status(200).json({ message: 'Success', rooms: list, hotel })
}

const updateHotel = async (req, res) => {
  if (req.files) {
    if (process.env.IMAGE_STORAGE === 'cloudinary') {
      const result = await cloudinary.uploader.upload(
        req.files.featuredImage.tempFilePath,
        {
          folder: 'hotel-images',
          use_filename: true,
        }
      )
      req.body.featuredImage = result.secure_url
      fs.unlinkSync(req.files.image.tempFilePath)
    } else {
      let productImage = req.files.featuredImage
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
      req.body.featuredImage = '/uploads/' + `${imageName}`
      await productImage.mv(imagePath)
    }
  }

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

const searchHotel = async (req, res) => {
  let { city, minprice, maxprice } = req.query
  minprice = minprice ? parseInt(minprice) : 0
  maxprice = maxprice ? parseInt(maxprice) : 100000

  if (city) {
    const hotels = await Hotel.find({
      city: { $regex: city, $options: 'i' },
      cheapestPrice: { $gte: minprice, $lte: maxprice },
    })
    return res
      .status(200)
      .json({ message: 'Success', count: hotels.length, items: hotels })
  }
  const hotels = await Hotel.find({
    cheapestPrice: { $gte: minprice, $lte: maxprice },
  })
  res
    .status(200)
    .json({ message: 'Success', count: hotels.length, items: hotels })
}

const getCity = async (req, res) => {
  const hotels = await Hotel.find({})
  const cities = hotels.map((hotel) => hotel.city)
  const uniqueCities = [...new Set(cities)]
  res.status(200).json({ message: 'Success', cities, uniqueCities })
}

module.exports = {
  createHotel,
  getHotels,
  getSingleHotel,
  updateHotel,
  deleteHotel,
  searchHotel,
  getCity,
}
