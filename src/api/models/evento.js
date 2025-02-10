const mongoose = require('mongoose')

const eventoSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    fecha: { type: Date, required: true },
    ubicacion: { type: String, required: true },
    descripcion: { type: String, required: true },
    asistentes: { type: [mongoose.Schema.Types.ObjectId], ref: 'User' },
    img: { type: String, required: true }
  },
  {
    timestamps: true,
    collection: 'eventos'
  }
)

const Evento = mongoose.model('eventos', eventoSchema, 'eventos')
module.exports = Evento
