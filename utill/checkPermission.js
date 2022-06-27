const checkPermission = (currentUser, requestUser) => {
  if (
    currentUser.role === 'admin' ||
    currentUser.id === requestUser._id.toString()
  ) {
    return true
  }
  return false
}

const isAdmin = (user) => {
  if (user.role === 'admin') {
    return true
  }
  return false
}
module.exports = { checkPermission, isAdmin }
