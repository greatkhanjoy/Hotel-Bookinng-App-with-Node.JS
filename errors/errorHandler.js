const ErrorHandler = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || 500,
    message: err.message || 'Something went wrong. Try again later.',
  }
  if (err.name === 'ValidationError') {
    customError.message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ')
    customError.statusCode = 400
  }
  //Validate Error
  if (err.code === 11000) {
    customError.message = `This ${Object.keys(err.keyPattern)} already exists`
    customError.statusCode = 400
  }

  //Cast Error
  if (err.name === 'CastError') {
    customError.message = `No data found with id: ${err.value}`
    customError.statusCode = 404
  }
  if (err.path === '_id') {
    customError.message = `No data found with id: ${err.value}`
    customError.statusCode = 404
  }

  // return res.status(err.statusCode || 500).json({ message: err })
  return res
    .status(customError.statusCode || 500)
    .json({ message: customError.message })
}

module.exports = ErrorHandler
