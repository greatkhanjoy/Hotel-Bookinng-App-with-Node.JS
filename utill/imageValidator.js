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

const getImageName = (image) => {
  let randomNM = Math.floor(Math.random() * (99999 - 100 + 1)) + 100
  let splitImageName = image.name.split('.')
  let imageName = splitImageName[0] + '-' + randomNM + '.' + splitImageName[1]
  return imageName
}

module.exports = { validateImageType, validateImageSize, getImageName }
