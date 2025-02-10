const { isAuth } = require('../../middlewares/auth')
const {
  getUsers,
  getUserById,
  registerAdmin,
  register,
  login,
  updateUser,
  addEventToInterested,
  removeEventFromInterested,
  loginOrRegister
} = require('../controllers/user')

const usersRouter = require('express').Router()

usersRouter.get('/', getUsers)
usersRouter.get('/:id', getUserById)
usersRouter.post('/registerAdmin', registerAdmin)
usersRouter.post('/register', register)
usersRouter.post('/login', login)
usersRouter.put('/:id', isAuth, updateUser)
usersRouter.put(
  '/:userId/add-interested/:eventId',
  isAuth,
  addEventToInterested
)
usersRouter.put(
  '/:userId/remove-interested/:eventId',
  isAuth,
  removeEventFromInterested
)
usersRouter.post('/auth', loginOrRegister)

module.exports = usersRouter
