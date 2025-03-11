const route = require('express').Router()

const { validateActivity } = require('../middlewares/validator.js')

const {
  createActivity,
  getAllActivities,
  getSingleActivity,
  searchActivity,
  filterActivity,
  updateActivity,
  deleteActivity,
} = require('../handlers/asctivities.js')

route.post('/', validateActivity, createActivity)
route.get('/', getAllActivities)
route.get('/:uuid', getSingleActivity)
route.get('/search', searchActivity)
route.get('/filter', filterActivity)
route.patch('/:uuid', updateActivity)
route.delete('/:uuid', deleteActivity)

module.exports = route
