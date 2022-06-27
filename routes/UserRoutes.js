const express = require('express')
const Router = express.Router()
const {
  loggedin,
  admin,
  authorizedUser,
} = require('../middlewares/Authentication')

const {
  createUser,
  getUsers,
  getSingleUser,
  updateUser,
  updateUserPassword,
  deleteUser,
  showMe,
} = require('../controllers/UserController')

Router.route('/')
  .get(loggedin, admin, getUsers)
  .post(loggedin, admin, createUser)
Router.route('/me').get(loggedin, showMe)
Router.route('/:id')
  .get(loggedin, getSingleUser)
  .put(loggedin, updateUser)
  .delete(loggedin, deleteUser)
Router.route('/:id/password').put(loggedin, updateUserPassword)

module.exports = Router
