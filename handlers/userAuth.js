const { User } = require('../models');
const crypto = require('crypto');
const { Op } = require('sequelize')
const asyncErrorHandler = require('../utils/asyncErrorHandler.js')
const errorCustom = require('../utils/errorCustom.js')
const sendVerifEmail = require('../utils/sendVerifEmail.js')
const sendResetPassEmail = require('../utils/sendResetPassEmail.js')

const {
  comparePassword,
  hashPassword,
  createJWT
} = require('../middlewares/auth.js');

const registerUser = asyncErrorHandler(
  async (req, res, next) => {
    const { email, password } = req.body;
    const emailToken = crypto.randomBytes(64).toString('hex');

    const user = await User.create({
      email,
      password: await hashPassword(password),
      emailToken
    })

    sendVerifEmail(email, emailToken)
    const token = createJWT(user);

    res.status(201)
      .json({
      status: 'success',
      message: 'User created',
      user: {
        uuid: user.uuid,
        email: user.email,
      },
      token,
      emailToken
    })
  }
)

const loginUser = asyncErrorHandler(
  async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: {
        email,
      }
    })

    if(!user){
      return next(new errorCustom('Account Invalid!, please sign up', 404))
    }

    if(!user.verified){
      sendVerifEmail(user.email, user.emailToken)
      return next(new errorCustom('Account need to be verified!', 403))
    }

    if(!password){
      return res.status(200).json({
      status: 'success',
      message: 'Please enter your password',
      user: {
        uuid: user.uuid,
        email: user.email,
      },
    })
    }

    const passwordMatch = await comparePassword(password, user.password)

    if(!passwordMatch){
      return next(new errorCustom('Wrong password!', 401))
    }

    const token = createJWT(user);

    res.status(200)
      .json({
      status: 'success',
      message: 'User logged in',
      user: {
        uuid: user.uuid,
        email: user.email,
      },
      token
    })
  }
)

const verifyEmail = asyncErrorHandler(
  async(req, res, next) => {
    const emailToken = req.body.emailToken;

    if(!emailToken){
      return next(new errorCustom('Invalid request', 400))
    }

    const user = await User.findOne({
      where: {
        emailToken 
      }
    })

    if(!user){
      return next(new errorCustom('User not found', 404))
    } 

    user.verified = true
    user.emailToken = null
    await user.save()

    res.status(200).json({
      status: 'success',
      message: 'User Verified'
    })
  }
)

const forgotPassword = asyncErrorHandler(
  async(req, res, next) => {
    const email = req.body.email

    const user = await User.findOne({
      where: {
        email 
      } 
    })

    if(!user){
      return next(new errorCustom('User not found', 404))
    }

    const resetToken = user.createResetPasswordToken()
    await user.save()

    try{
      await sendResetPassEmail(email, resetToken)

      res.status(200).json({
        status:'success',
        message: 'Reset password email sent'
      })
    } catch(err) {
      user.passwordResetToken = null
      user.passwordResetTokenExpires = null
      user.save()

      return next(new errorCustom('Failed to send password reset email', 500))
    }
  }
)

const resetPassword = asyncErrorHandler(
  async (req, res, next) => {
    const resetToken = crypto.createHash('sha256')
      .update(req.body.resetToken)
      .digest('hex') 
    
    const user = await User.findOne({
      where: {
        passwordResetToken: resetToken,
        passwordResetTokenExpires: {
          [Op.gt]: Date.now() 
        }
      }
    })

    if(!user){
      return next(new errorCustom('Token is invalid or has expired!', 400))
    }

    user.password = await hashPassword(req.body.newPassword)
    user.passwordResetToken = null
    user.passwordResetTokenExpires = null
    user.passwordChangedAt = Date.now()
    await user.save()

    const loginToken = createJWT(user);

    res.status(200)
      .json({
      status: 'success',
      message: 'User logged in',
      loginToken
    })
  }
)

const deleteUser = asyncErrorHandler(
  async (req, res, next) => {
    const user = await User.findByPk(req.params.uuid)

    await user.destroy()

    res.status(200).json({
      status: 'success',
      message: 'Activity Deleted',
    })
  }
)

module.exports = {
  registerUser, 
  loginUser, 
  verifyEmail, 
  deleteUser,
  forgotPassword,
  resetPassword
}