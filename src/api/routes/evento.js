const { isAuth } = require('../../middlewares/auth')
const upload = require('../../middlewares/file')
const {
  getEventos,
  getEventoById,
  postEvento,
  updateEvento,
  deleteEvento,
  getEventsByDate,
  getEventsByAttendees
} = require('../controllers/evento')

const eventosRouter = require('express').Router()

eventosRouter.get('/', getEventos)
eventosRouter.get('/:id', getEventoById)
eventosRouter.post('/', isAuth, upload.single('img'), postEvento)
eventosRouter.put('/:id', isAuth, upload.single('img'), updateEvento)
eventosRouter.delete('/:id', deleteEvento)
eventosRouter.get('/sorted/by-date', getEventsByDate)
eventosRouter.get('/sorted/by-attendees', getEventsByAttendees)

module.exports = eventosRouter
