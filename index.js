const express = require('express')
const dotenv = require('dotenv')
dotenv.config()
const { sequelize } = require('./models/index.js')
const cors = require('cors')
const morgan = require('morgan')
const globalErrorHandler = require('./middlewares/globalErrorHandler.js')
const { protect } = require('./middlewares/auth.js')
const userRoutes = require('./routes/userRoutes.js')
const activityRoutes = require('./routes/activityRoutes.js')
const errorCustom = require('./utils/errorCustom.js')
const app = express()
const PORT = process.env.PORT

app.use(express.static(Path.join(__dirname, 'assets')));
//middlware
app.use(cors())
// app.use(cors({
//   origin: '*',
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   "preflightContinue": false,
//   "optionsSuccessStatus": 204
// }));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

// Loggin middleware
app.use(
  (req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
  }
)

//routes
app.get("/", (req, res) => res.send("Express on Vercel"));
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/activity', protect, activityRoutes)

app.use('*', (req, res, next) => {
  const err = new errorCustom('No routes found', 404)
  next(err)
})

//error handler
app.use(globalErrorHandler)

// app.listen(PORT, async() => {
//   try {
//     await sequelize.authenticate()
//     console.log('Database connection has been established successfully.')

//     console.log(`Server is running on port ${PORT}`)
//   } catch (error) {
//     console.error('Unable to connect to the database:', error)
//     process.exit(1)
//   }
// })
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  (async () => {
    try {
      await sequelize.authenticate();
      console.log('DB connected');
      app.listen(PORT, () => console.log(`Listening on ${PORT}`));
    } catch (err) {
      console.error('DB failed', err);
      process.exit(1);
    }
  })();
}

module.exports=app