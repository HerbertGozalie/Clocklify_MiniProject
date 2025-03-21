const route = require('express').Router()
const {
  registerUser, 
  loginUser, 
  verifyEmail, 
  deleteUser,
  forgotPassword,
  resetPassword
} = require('../handlers/userAuth.js')

const {
  validateUserRegister, 
  validateUserLogin,
  validateUserResetPassword
} = require('../middlewares/validator.js');

route.post('/register', validateUserRegister, registerUser)
route.patch('/verifyemail', verifyEmail)
route.post('/login', validateUserLogin, loginUser)
route.post('/forgotpassword', forgotPassword)
route.patch('/resetpassword', validateUserResetPassword, resetPassword)
route.delete('/:uuid', deleteUser)

module.exports = route
