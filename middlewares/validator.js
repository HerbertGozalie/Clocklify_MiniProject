const { body, validationResult } = require('express-validator');
const errorCustom = require('../utils/errorCustom.js');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return next(new errorCustom(
      Object.fromEntries(errors.array().map(err => [err.param, err.msg])), 400
    ))
  }
  next()
}

const validateUserRegister = [
  body('email').isEmail().withMessage('Invalid email'),
  body("password")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
    .matches(/^\S.*\S$/).withMessage("Password cannot start or end with spaces")
    .matches(/[A-Z]/).withMessage("Must contain an uppercase letter")
    .matches(/[a-z]/).withMessage("Must contain a lowercase letter")
    .matches(/[0-9]/).withMessage("Must contain a number")
    .matches(/[\W_]/).withMessage("Must contain a special character"),
  validateRequest
]

const validateUserLogin = [
  body('email').isEmail().withMessage('Invalid email'),
  body("password")
    .notEmpty().withMessage("Password must be filled"),
  validateRequest
]

module.exports = {
  validateUserRegister,
  validateUserLogin
}