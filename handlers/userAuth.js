const { User } = require('../models');
const asyncHandler = require('../utils/asyncHandler.js')
const errorCustom = require('../utils/errorCustom.js')
const {
  comparePassword,
  hashPassword,
  createJWT
} = require('../middlewares/auth.js');

const registerUser = asyncHandler(
  async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.create({
      email,
      password: await hashPassword(password),
    })

    const token = createJWT(user);
    res.status(201).json({
      status: 'success',
      message: 'User created',
      user: {
        uuid: user.uuid,
        email: user.email,
      },
      token,
    })
  }
)

const loginUser = asyncHandler(
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

    const passwordMatch = await comparePassword(password, user.password)

    if(!passwordMatch){
      return next(new errorCustom('Wrong password!', 401))
    }

    const token = createJWT(user);
    res.status(200).json({
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

module.exports = { registerUser, loginUser }