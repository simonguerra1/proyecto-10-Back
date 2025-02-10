const jwt = require('jsonwebtoken')

const generarLlave = (id) => {
  console.log('JWT_SECRET:', process.env.JWT_SECRET)
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1y' })
}

const verificarLlave = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET)
}

module.exports = { generarLlave, verificarLlave }
