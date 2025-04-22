const { body, validationResult } = require('express-validator');
const errorCustom = require('../utils/errorCustom.js');

const { User } = require('../src/models/index.js');

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
    .isEmail().withMessage('Invalid email'),
    // .custom(async value => {
    //   const existingUser = await User.findOne({
    //     where: { email: value }
    //   });
      
    //   if(existingUser){
    //     throw new errorCustom('Email already exists!', 409);
    //   }
    // }),
  body("password")
    .notEmpty().withMessage("Password must be filled")
    .isStrongPassword().withMessage("Password has to be strong!"),
  body("confirmPassword")
    .notEmpty().withMessage("Confirm password must be filled")
    .custom((value, {req}) => {
      if(value !== req.body.password){
        throw new errorCustom('Passwords do not match!', 400);
      }
      return true
    }),
  validateRequest
]

const validateUserLogin = [
  body('email')
    .notEmpty().withMessage("Email must be filled")
    .isEmail().withMessage('Invalid email'),
  validateRequest
]

const validateUserResetPassword = [
  body("newPassword")
    .notEmpty().withMessage("Password must be filled")
    .isStrongPassword().withMessage("Password has to be strong!"),
  body("confirmPassword")
    .notEmpty().withMessage("Confirm password must be filled")
    .custom((value, {req}) => {
      if(value !== req.body.newPassword){
        throw new errorCustom('Passwords do not match!', 400);
      }
      return true
    }),
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

const validateTimeAndLocation = [
  body("start_time")
    .optional()
    .isISO8601().withMessage("Start time must be a date"),
  body("end_time")
    .optional()
    .isISO8601().withMessage("End time must be a date"),
  body("location_lat")
    .optional()
    .isFloat({
      min: -90,
      max: 90
    }). withMessage("Location must be between -90 and 90"),
  body("location_lng")
    .optional()
    .isFloat({
      min: -180,
      max: 180
    }). withMessage("Location must be between -180 and 180"),
  validateRequest
]

module.exports = {
  validateUserRegister,
  validateUserLogin,
  validateActivity,
  validateTimeAndLocation,
  validateUserResetPassword
}