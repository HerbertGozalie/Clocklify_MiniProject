const { User } = require('../models');
const crypto = require('crypto');
const asyncErrorHandler = require('../utils/asyncErrorHandler.js')
const errorCustom = require('../utils/errorCustom.js')
const sendEmail = require('../utils/sendEmail.js')

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

    sendEmail(email, emailToken)

    const token = createJWT(user);

    res.status(201)
      .header("Authorization", `Bearer ${token}`)
      .json({
      status: 'success',
      message: 'User created',
      user: {
        uuid: user.uuid,
        email: user.email,
      },
      token
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
      sendEmail(user.email, user.emailToken)
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
      .header("Authorization", `Bearer ${token}`)
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
    const { emailToken } = req.query;

    if(!emailToken){
      return next(new errorCustom('Invalid request', 400))
    }

    const user = await User.findOne({ where: { emailToken } })

    if(!user){
      return next(new errorCustom('User not found', 404))
    } 

    await User.update(
      { verified: true, emailToken: null },
      { where: { emailToken } }
    )

    res.status(200).json({
      status: 'success',
      message: 'User Verified'
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
  deleteUser
}