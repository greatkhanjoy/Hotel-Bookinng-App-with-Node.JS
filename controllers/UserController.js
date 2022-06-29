const User = require('../models/User')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const { sendVerificationMail } = require('../utill/email')
const { checkPermission, isAdmin } = require('../utill')
const {
  validateImageType,
  validateImageSize,
  getImageName,
} = require('../utill')
const path = require('path')

const createUser = async (req, res) => {
  let { name, username, email, password, image, role } = req.body
  const verificationToken = crypto.randomBytes(40).toString('hex')

  if (req.files) {
    if (process.env.IMAGE_STORAGE === 'cloudinary') {
      const result = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        {
          folder: 'hotel-images',
          use_filename: true,
        }
      )
      image = result.secure_url
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
      image = '/uploads/' + `${imageName}`
      await productImage.mv(imagePath)
    }
  }

  if (req.user.role === 'admin') {
    role = role ? role : 'user'
  } else {
    role = 'user'
  }
  const user = new User({
    name,
    username,
    email,
    password,
    verificationToken,
    image,
    role,
  })
  await user.save()
  const userData = {
    _id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
    image: user.image,
  }
  sendVerificationMail(user.email, user.verificationToken)
  res.status(201).json({ message: 'User created successfully', userData })
}

const getUsers = async (req, res) => {
  const users = await User.find().select(
    '-password -verificationToken -resetPasswordToken -resetPasswordExpires'
  )
  res.status(200).json({ message: 'Success', count: users.length, users })
}

const getSingleUser = async (req, res) => {
  const user = await User.findById(req.params.id).select(
    '-password -verificationToken -resetPasswordToken -resetPasswordExpires'
  )
  const isAuthorized = checkPermission(req.user, user)
  if (!isAuthorized) {
    return res.status(403).json({ message: 'Forbidden' })
  }
  res.status(200).json({ message: 'Success', user })
}

const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }
  const isAuthorized = checkPermission(req.user, user)
  if (!isAuthorized) {
    return res.status(403).json({ message: 'Forbidden' })
  }

  let {
    password,
    role,
    verified,
    verificationToken,
    resetPasswordToken,
    resetPasswordExpires,
    ...data
  } = req.body

  if (req.user.role === 'admin') {
    role = role ? role : user.role
    verified = verified ? verified : user.verified
    verificationToken = verificationToken
      ? verificationToken
      : user.verificationToken
    resetPasswordToken = resetPasswordToken
      ? resetPasswordToken
      : user.resetPasswordToken
    resetPasswordExpires = resetPasswordExpires
      ? resetPasswordExpires
      : user.resetPasswordExpires
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
      data.image = result.secure_url
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
      data.image = '/uploads/' + `${imageName}`
      await productImage.mv(imagePath)
    }
  }

  const updateUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      ...data,
      role,
      verified,
      verificationToken,
      resetPasswordToken,
      resetPasswordExpires,
    },
    {
      new: true,
      runValidators: true,
    }
  ).select(
    '-password -verificationToken -resetPasswordToken -resetPasswordExpires'
  )
  res.status(200).json({ message: 'Success', updateUser })
}

const updateUserPassword = async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }
  const isAuthorized = checkPermission(req.user, user)
  if (!isAuthorized) {
    return res.status(403).json({ message: 'Forbidden' })
  }
  let { old_password, new_password } = req.body

  if (!old_password || !new_password) {
    return res
      .status(400)
      .json({ message: 'Old and new password are required' })
  }

  const isMatch = await bcrypt.compare(old_password, user.password)
  if (!isMatch) {
    return res.status(400).json({ message: 'Old password is incorrect' })
  }

  user.password = new_password
  user.save()
  res.status(200).json({ message: 'Password changed successfuly' })
}

const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }
  const isAuthorized = checkPermission(req.user, user)
  if (!isAuthorized) {
    return res.status(403).json({ message: 'Forbidden' })
  }

  await User.findByIdAndDelete(req.params.id)
  res.status(200).json({ message: 'Success' })
}

const showMe = async (req, res) => {
  const { id } = req.user
  const user = await User.findById(id).select(
    '-password -verificationToken -resetPasswordToken -resetPasswordExpires'
  )
  res.status(200).json({ message: 'Success', user })
}

module.exports = {
  createUser,
  getUsers,
  getSingleUser,
  updateUser,
  updateUserPassword,
  deleteUser,
  showMe,
}
