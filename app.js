const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const globalErrorHandler = require('./middlewares/globalErrorHandler.js')
const { protect } = require('./middlewares/auth.js')

const userRoutes = require('./routes/userRoutes.js')
const activityRoutes = require('./routes/activityRoutes.js')

const errorCustom = require('./utils/errorCustom.js')

const app = express()

// Loggin middleware
app.use(
  (req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
  }
)

//middlware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

//routes
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/activity', protect, activityRoutes)

app.use('*', (req, res, next) => {
  const err = new errorCustom('No routes found', 404)
  next(err)
})

//error handler
app.use(globalErrorHandler)

module.exports=app