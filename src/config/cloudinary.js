const cloudinary = require('cloudinary').v2

const connectCloudinary = () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET
    })
    console.log('Conectamos con exito a Cloudinary')
  } catch (error) {
    console.log('No se puede conectar a Cloudinary')
  }
}

module.exports = { connectCloudinary }
