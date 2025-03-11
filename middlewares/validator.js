const { body, validationResult } = require('express-validator');
const errorCustom = require('../utils/errorCustom.js');

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    const errorsMapped = validationResult(req).mapped();

    if(!errors.isEmpty()){
      return next(new errorCustom(errorsMapped, 400))
    }

    next();
}

const validateUserRegister = [
  body('email')
    .notEmpty().withMessage("Email must be filled")
    .isEmail().withMessage('Invalid email'),
  body("password")
    .notEmpty().withMessage("Password must be filled")
    .isStrongPassword().withMessage("Password has to be strong!"),
  validateRequest
]

const validateUserLogin = [
  body('email')
    .notEmpty().withMessage("Email must be filled")
    .isEmail().withMessage('Invalid email'),
  body("password")
    .notEmpty().withMessage("Password must be filled"),
  validateRequest
]

const validateActivity = [
  body('description')
    .notEmpty().withMessage("Description must be filled"),
  body("start_time")
    .notEmpty().withMessage("Start time must be filled"),
  body("end_time")
    .notEmpty().withMessage("End time must be filled"),
  body("location_lat")
    .notEmpty().withMessage("Location must be filled"),
  body("location_lng")
    .notEmpty().withMessage("Location must be filled"),
  validateRequest
]

module.exports = {
  validateUserRegister,
  validateUserLogin,
  validateActivity
}