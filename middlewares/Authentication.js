const { verifyJWT } = require('../utill/index')

const loggedin = async (req, res, next) => {
  if (!req.signedCookies.token) {
    return res.status(401).json({ msg: 'Unauthorized. Please login' })
  }
  const payload = await verifyJWT(req.signedCookies.token)
  if (!payload) {
    return res.status(401).json({ msg: 'Unauthorized. Please login' })
  }
  req.user = payload
  next()
}

const admin = async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res
      .status(401)
      .json({ msg: "You don't have permission to access this route!" })
  }
  next()
}

const authorizedUser = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(401)
        .json({ msg: "You don't have permission to access this route!" })
    }
    next()
  }
}

module.exports = { loggedin, admin, authorizedUser }
