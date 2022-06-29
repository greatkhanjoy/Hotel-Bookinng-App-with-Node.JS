const Hotel = require('../models/Hotel')
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

module.exports = {
  createHotel,
  getHotels,
  getSingleHotel,
  updateHotel,
  deleteHotel,
}
