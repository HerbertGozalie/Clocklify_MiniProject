const route = require('express').Router()
const {
  registerUser, 
  loginUser, 
  verifyEmail, 
  deleteUser 
} = require('../handlers/userAuth.js')

const {
  validateUserRegister, 
  validateUserLogin
} = require('../middlewares/validator.js');

route.post('/register', validateUserRegister, registerUser)
route.get('/verifyemail', verifyEmail)
route.post('/login', validateUserLogin, loginUser)

route.delete('/:uuid', deleteUser)

module.exports = route
