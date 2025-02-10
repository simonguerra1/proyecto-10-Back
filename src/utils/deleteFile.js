const cloudinary = require('cloudinary').v2

const deleteFile = (url) => {
  console.log('URL recibida:', url)

  if (!url) return console.log('No se proporcionó una URL válida')

  const imgSplited = url.split('/')
  const folderName = imgSplited.at(-2)
  const fileName = imgSplited.at(-1).split('.')[0]

  cloudinary.uploader.destroy(`${folderName}/${fileName}`, (error, result) => {
    if (error) {
      console.error('Error al eliminar la imagen:', error)
    } else {
      console.log('Imagen eliminada:', result)
    }
  })
}

cloudinary.uploader.destroy('nombreCarpeta/nombreArchivo', () => {
  // console.log('Archivo destruido')
})

module.exports = deleteFile
