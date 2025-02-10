const { generarLlave } = require('../../utils/jwt')
const Evento = require('../models/evento')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate('favoritos')
    return res.status(200).json(users)
  } catch (error) {
    return res.status(400).json('error')
  }
}

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await User.findById(id).populate('favoritos')
    return res.status(200).json(user)
  } catch (error) {
    return res.status(400).json('error')
  }
}

const registerAdmin = async (req, res, next) => {
  try {
    console.log('Datos recibidos en el request body:', req.body)

    const userDuplicated = await User.findOne({ userName: req.body.userName })
    console.log('Usuario duplicado encontrado:', userDuplicated)

    if (userDuplicated) {
      console.log('Error: Usuario ya existente')
      return res.status(400).json({ error: 'Usuario ya existente' })
    }

    const newUser = new User({
      userName: req.body.userName,
      password: req.body.password,
      email: req.body.email,
      interesado: [],
      rol: 'admin'
    })

    console.log('Nuevo usuario creado (antes de guardar):', newUser)

    const user = await newUser.save()
    console.log('Usuario guardado correctamente:', user)

    return res.status(201).json(user)
  } catch (error) {
    console.error('Error en register:', error)
    return res
      .status(500)
      .json({ error: 'Error en el registro', details: error.message })
  }
}

const register = async (req, res, next) => {
  try {
    console.log('Datos recibidos en el request body:', req.body)

    const userDuplicated = await User.findOne({ userName: req.body.userName })
    console.log('Usuario duplicado encontrado:', userDuplicated)

    if (userDuplicated) {
      console.log('Error: Usuario ya existente')
      return res.status(400).json({ error: 'Usuario ya existente' })
    }

    const newUser = new User({
      userName: req.body.userName,
      password: req.body.password,
      email: req.body.email,
      interesado: [],
      rol: 'user'
    })

    console.log('Nuevo usuario creado (antes de guardar):', newUser)

    const user = await newUser.save()
    console.log('Usuario guardado correctamente:', user)

    return res.status(201).json(user)
  } catch (error) {
    console.error('Error en register:', error)
    return res
      .status(500)
      .json({ error: 'Error en el registro', details: error.message })
  }
}

const login = async (req, res, next) => {
  try {
    console.log('Datos recibidos en el request body:', req.body)

    const { userName, password } = req.body

    if (!userName || !password) {
      console.log('Error: Falta userName o password en la solicitud.')
      return res.status(400).json({ error: 'Faltan credenciales' })
    }

    const user = await User.findOne({ userName })

    if (!user) {
      console.log(`Error: Usuario no encontrado (${userName})`)
      return res.status(400).json({ error: 'Usuario o contraseña incorrectos' })
    }

    if (!bcrypt.compareSync(password, user.password)) {
      console.log(`Error: Contraseña incorrecta para el usuario (${userName})`)
      return res.status(400).json({ error: 'Usuario o contraseña incorrectos' })
    }

    const token = generarLlave(user._id)
    console.log(`Usuario autenticado: ${userName}`)

    return res.status(200).json({ token, user })
  } catch (error) {
    console.error('Error en login:', error)
    return res.status(500).json({ error: 'Error en el servidor' })
  }
}

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params

    if (req.user._id.toString() !== id) {
      return res
        .status(400)
        .json('No puedes modificar a alguien que no seas tu mismo')
    }

    const oldUser = await User.findById(id)
    const newUser = new User(req.body)
    newUser._id = id
    newUser.favoritos = [...oldUser.favoritos, ...newUser.favoritos]
    const userUpdated = await User.findByIdAndUpdate(id, newUser, {
      new: true
    })

    return res.status(200).json(userUpdated)
  } catch (error) {
    return res.status(400).json('error')
  }
}

const loginOrRegister = async (req, res) => {
  try {
    const { userName, password, email } = req.body

    let user = await User.findOne({ userName })

    if (user) {
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(400).json({ error: 'Contraseña incorrecta' })
      }
    } else {
      user = new User({ userName, password, email })
      await user.save()
    }

    const token = generarLlave(user._id)

    return res.status(200).json({ token, user })
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Error en la autenticación', details: error.message })
  }
}

const addEventToInterested = async (req, res) => {
  try {
    const { userId, eventId } = req.params

    const user = await User.findById(userId)
    const event = await Evento.findById(eventId)

    if (!user || !event) {
      return res.status(404).json({ error: 'Usuario o evento no encontrado' })
    }

    if (user.interesado.includes(eventId)) {
      return res
        .status(400)
        .json({ error: 'El evento ya está en la lista de interesados' })
    }

    user.interesado.push(eventId)

    // 🔥 Evita que se re-hashee la contraseña
    await user.save({ validateModifiedOnly: true })

    return res
      .status(200)
      .json({ message: 'Evento añadido a la lista de interesados', user })
  } catch (error) {
    console.error('Error en addEventToInterested:', error)
    return res
      .status(500)
      .json({ error: 'Error al agregar evento a la lista de interesados' })
  }
}

const removeEventFromInterested = async (req, res) => {
  try {
    const { userId, eventId } = req.params
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    if (!user.interesado.includes(eventId)) {
      return res.status(200).json({
        message:
          'El evento no estaba en la lista de interesados, pero la operación fue exitosa.'
      })
    }

    user.interesado = user.interesado.filter((id) => id.toString() !== eventId)

    // 🔥 Evita que se re-hashee la contraseña
    await user.save({ validateModifiedOnly: true })

    return res
      .status(200)
      .json({ message: 'Evento eliminado de interesados', user })
  } catch (error) {
    console.error('Error en removeEventFromInterested:', error)
    return res
      .status(500)
      .json({ error: 'Error al eliminar el evento de interesados' })
  }
}

module.exports = {
  getUsers,
  getUserById,
  registerAdmin,
  register,
  updateUser,
  login,
  addEventToInterested,
  removeEventFromInterested,
  loginOrRegister
}
