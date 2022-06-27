const errorHandler = (error, _req, res, _next) => {
  if (error.status) {
    return res.status(error.status).json({ message: error.message })
  }

  res.status(500).json({ message: 'Something went wrong!' })
}

const notFoundHandler = (_req, _res, next) => {
  const error = new Error('404 Not Found!')
  error.status = 404
  next(error)
}

module.exports = { errorHandler, notFoundHandler }
