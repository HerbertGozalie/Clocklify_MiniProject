const route = require('express').Router()

const { 
  validateActivity, 
  validateTimeAndLocation 
} = require('../middlewares/validator.js')

const {
  createActivity,
  getAllActivities,
  getSingleActivity,
  updateActivity,
  deleteActivity,
} = require('../handlers/asctivities.js')

route.post('/', validateActivity, createActivity)
route.get('/', getAllActivities)
route.get('/:uuid', getSingleActivity)
route.patch('/:uuid', validateTimeAndLocation, updateActivity)
route.delete('/:uuid', deleteActivity)

module.exports = route
