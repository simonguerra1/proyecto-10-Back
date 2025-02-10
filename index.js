require('dotenv').config()
const express = require('express')
const { connectDB } = require('./src/config/db')
const usersRouter = require('./src/api/routes/user')
const cors = require('cors')
const eventosRouter = require('./src/api/routes/evento')
const { connectCloudinary } = require('./src/config/cloudinary')

const app = express()

connectDB()
connectCloudinary()

app.use(cors())

//Importante para interpretar datos json
app.use(express.json())

app.use('/api/v1/eventos', eventosRouter)
app.use('/api/v1/users', usersRouter)

app.use('*', (req, res, next) => {
  return res.status(404).json('Route Not Found')
})

app.listen(3000, () => {
  console.log('http://localhost:3000')
})
