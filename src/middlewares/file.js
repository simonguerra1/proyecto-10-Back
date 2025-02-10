const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: async (req, file) => {
//     let folderName = 'Eventos'
//     if (req.body.folderName) {
//       folderName = req.body.folderName
//     } else if (file.mimetype.startsWith('image')) {
//       folderName = 'Eventos'
//     } else if (file.mimetype.startsWith('video')) {
//       folderName = 'Eventos'
//     }

//     return {
//       folder: folderName,
//       allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp']
//     }
//   }
// })

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'Eventos', //
      format: file.mimetype.split('/')[1], // Obtiene la extensión del archivo
      public_id: file.originalname.split('.')[0] // Usa el nombre original sin la extensión
    }
  }
})

const upload = multer({ storage })
module.exports = upload
