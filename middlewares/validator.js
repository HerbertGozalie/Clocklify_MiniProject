const { body, validationResult } = require('express-validator');
const errorCustom = require('../utils/errorCustom.js');

const { User } = require('../models');

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    const errorsMapped = errors.mapped();

    if(!errors.isEmpty()){
      return next(new errorCustom(errorsMapped, 400))
    }

    next();
}

const validateUserRegister = [
  body('email')
    .notEmpty().withMessage("Email must be filled")
    .isEmail().withMessage('Invalid email')
    .custom(async value => {
      const existingUser = await User.findOne({
        where: { email: value }
      });
      /**
       * need to be fix
       */
      if(existingUser){
        throw new errorCustom('Email already exists!', 409);
        
      }
    }),
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
    .notEmpty().withMessage("Start time must be filled")
    .isISO8601().withMessage("Start time must be a date"),
  body("end_time")
    .notEmpty().withMessage("End time must be filled")
    .isISO8601().withMessage("End time must be a date"),
  body("location_lat")
    .notEmpty().withMessage("Location must be filled")
    .isFloat({
      min: -90,
      max: 90
    }). withMessage("Location must be between -90 and 90"),
  body("location_lng")
    .notEmpty().withMessage("Location must be filled")
    .isFloat({
      min: -180,
      max: 180
    }). withMessage("Location must be between -180 and 180"),
  validateRequest
]

module.exports = {
  validateUserRegister,
  validateUserLogin,
  validateActivity
}