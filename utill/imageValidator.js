const validateImageType = (image) => {
  let imageType = image.mimetype.split('/')[0]
  let imageExtension = image.mimetype.split('/')[1]

  if (
    imageType !== 'image' &&
    (imageExtension !== 'jpeg' ||
      imageExtension !== 'png' ||
      imageExtension !== 'jpg' ||
      imageExtension !== 'gif')
  ) {
    return false
  }
  return true
}

const validateImageSize = (image, size) => {
  if (image.size > size) {
    return false
  }
  return true
}

module.exports = { validateImageType, validateImageSize }
