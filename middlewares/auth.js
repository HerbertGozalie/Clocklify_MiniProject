const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const errorCustom = require('../utils/errorCustom.js');
const saltRounds = 10;

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

const protect = (req, res ,next) => {
  const bearer = req.headers.authorization

  if(!bearer || !bearer.startsWith('Bearer ')){
    return next(new errorCustom('Unauthorized: no token provided', 401))
  }

  const token = bearer.split(' ')[1]

  if(!token){
    return next(new errorCustom('Unauthorized: no token provided', 401))
  }

  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } 
  catch(error){
    next(new errorCustom('Unauthorized: Invalid token', 401))
  }   
}


module.exports = {
  comparePassword,
  hashPassword,
  createJWT,
  protect
}