const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const errorCustom = require('../utils/errorCustom.js');
const asyncHandler = require('../utils/asyncHandler.js');


const comparePassword = (password, hash) => {
  return bcrypt.compare(password, hash);
}

const hashPassword = (password) => {
  return bcrypt.hash(password, saltRounds);
}

const createJWT = (user) => {
  const token = jwt.sign({
    uuid: user.uuid,
    email: user.email,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: '1h',
  })
  return token;
}

const protect = asyncHandler(
  async(req, res ,next) => {
  const bearer = req.headers.authorization

  if(!bearer || !bearer.startsWith('Bearer ')){
    throw new errorCustom('Unauthorized: no token provided', 401)
  }

  const token = bearer.split(' ')[1]

  if(!token){
    throw new errorCustom('Unauthorized: no token provided', 401)
  }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
}
)

module.exports = {
  comparePassword,
  hashPassword,
  createJWT,
  protect
}