const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const globalErrorHandler = require('./middlewares/errorHandler.js')
const userRoutes = require('./routes/userRoutes.js')

const app = express()

//middlware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

//routes
app.use('/api/v1/users', userRoutes)

//error handler
app.use(globalErrorHandler)

module.exports=app