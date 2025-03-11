const dotenv = require('dotenv')
dotenv.config()

const app = require('./app.js')
const { sequelize } = require('./models')
const PORT = process.env.PORT



app.listen(PORT, async() => {
  
  try {
    await sequelize.authenticate()
    console.log('Database connection has been established successfully.')

    console.log(`Server is running on port ${PORT}`)
  } catch (error) {
    console.error('Unable to connect to the database:', error)
    process.exit(1)
  }
})
