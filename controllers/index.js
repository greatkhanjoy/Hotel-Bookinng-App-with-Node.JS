const health = (_req, res) => {
  res.status(200).json({ message: 'Success!' })
}

module.exports = { health }
