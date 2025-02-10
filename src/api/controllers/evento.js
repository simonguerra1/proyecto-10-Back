const deleteFile = require('../../utils/deleteFile')
const Evento = require('../models/evento')

const getEventos = async (req, res, next) => {
  try {
    const eventos = await Evento.find()
    return res.status(200).json(eventos)
  } catch (error) {
    return res.status(400).json('error')
  }
}

const getEventoById = async (req, res, next) => {
  try {
    const { id } = req.params
    const evento = await Evento.findById(id)
    return res.status(200).json(evento)
  } catch (error) {
    return res.status(400).json('error')
  }
}

const postEvento = async (req, res, next) => {
  try {
    const newEvento = new Evento(req.body)

    if (req.file) {
      console.log('📂 Archivo cargado correctamente:', req.file.filename)
      newEvento.img = req.file.path
    } else {
      console.log('⚠️ No se encontró ningún archivo en la solicitud.')
    }

    const evento = await newEvento.save()
    console.log('✅ Evento creado exitosamente:', evento)
    return res.status(201).json(evento)
  } catch (error) {
    console.error('❌ Error al subir el evento:', error.message)
    return res
      .status(400)
      .json({ error: 'Error al subir evento', details: error.message })
  }
}

const updateEvento = async (req, res, next) => {
  try {
    const { id } = req.params

    const eventoExistente = await Evento.findById(id)
    if (!eventoExistente) {
      return res.status(404).json({ error: 'Evento no encontrado' })
    }

    if (req.file) {
      if (
        eventoExistente.img &&
        eventoExistente.img.includes('cloudinary.com')
      ) {
        console.log(
          `Eliminando imagen anterior de Cloudinary: ${eventoExistente.img}`
        )
        deleteFile(eventoExistente.img)
      }

      console.log('Nueva imagen subida:', req.file.path)
      req.body.img = req.file.path
    }

    const eventoUpdated = await Evento.findByIdAndUpdate(id, req.body, {
      new: true
    })

    return res.status(200).json(eventoUpdated)
  } catch (error) {
    console.error('Error en updateEvento:', error)
    return res.status(400).json({ error: 'Error al actualizar evento' })
  }
}

const deleteEvento = async (req, res, next) => {
  try {
    const { id } = req.params
    console.log(`Intentando eliminar evento con ID: ${id}`)

    const eventoDeleted = await Evento.findByIdAndDelete(id)
    console.log('Evento eliminado de la base de datos:', eventoDeleted)

    if (!eventoDeleted) {
      console.log('Evento no encontrado en la base de datos.')
      return res.status(404).json({ message: 'Evento no encontrado' })
    }

    if (eventoDeleted.img) {
      console.log(
        `Intentando eliminar imagen de Cloudinary: ${eventoDeleted.img}`
      )
      deleteFile(eventoDeleted.img)
    } else {
      console.log('El evento eliminado no tenía imagen asociada.')
    }

    return res.status(200).json({
      mensaje: 'Evento eliminado con éxito'
    })
  } catch (error) {
    console.error('Error al eliminar evento:', error)
    return res.status(400).json(error)
  }
}

const getEventsByDate = async (req, res) => {
  try {
    const eventos = await Evento.find().sort({ fecha: -1 })
    return res.status(200).json(eventos)
  } catch (error) {
    return res
      .status(400)
      .json({ error: 'Error al obtener eventos ordenados por fecha' })
  }
}

const getEventsByAttendees = async (req, res) => {
  try {
    const eventos = await Evento.find().sort({ asistentes: -1 })
    return res.status(200).json(eventos)
  } catch (error) {
    return res
      .status(400)
      .json({ error: 'Error al obtener eventos ordenados por asistentes' })
  }
}

module.exports = {
  getEventos,
  getEventoById,
  postEvento,
  updateEvento,
  deleteEvento,
  getEventsByDate,
  getEventsByAttendees
}
