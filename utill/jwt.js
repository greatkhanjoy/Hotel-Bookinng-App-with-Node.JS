const jwt = require('jsonwebtoken')

const CreateJWT = (user) => {
  tokenUser = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
  const token = jwt.sign(tokenUser, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.JWT_EXP || '30d',
  })
  return token
}

const createTokenUser = (user) => {
  return { id: user._id, name: user.name, email: user.email, role: user.role }
}

const verifyJWT = async (token) => {
  const payload = await jwt.verify(token, process.env.JWT_SECRET || 'secret')
  return payload
}

const attachCookies = (res, token) => {
  const oneDay = 24 * 60 * 60 * 1000
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  })
}

module.exports = { CreateJWT, verifyJWT, attachCookies, createTokenUser }
