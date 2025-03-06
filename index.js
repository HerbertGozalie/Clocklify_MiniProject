const dotenv = require('dotenv')
dotenv.config()

const app = require('./app.js')
const { sequelize } = require('./models')
const PORT = process.env.PORT || 5000

app.listen(PORT, async() => {
  console.log(`Server is running on port ${PORT}`)
  try {
    await sequelize.authenticate()
    console.log('Database connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
})
