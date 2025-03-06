const express = require('express')
const route = express.Router()
const { registerUser, loginUser } = require('../handlers/userAuth.js')
const { validateUserRegister, validateUserLogin } = require('../middlewares/validator.js');

route.post('/register', validateUserRegister, registerUser)
route.post('/login', validateUserLogin, loginUser)

module.exports = route
