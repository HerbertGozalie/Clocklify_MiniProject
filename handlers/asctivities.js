const { Activity } = require('../models');
const { Op } = require('sequelize')
const asyncErrorHandler = require('../utils/asyncErrorHandler.js')
const errorCustom = require('../utils/errorCustom.js')
const moment = require('moment')
const haversine = require('haversine-distance')


const createActivity = asyncErrorHandler(
  async (req, res, next) => {
    const {
      description,
      start_time,
      end_time,
      location_lat,
      location_lng
    } = req.body;

    const startTime = moment(start_time)
    const endTime = moment(end_time)

    const durationTime = endTime.diff(startTime, 'seconds')

    const activity = await Activity.create({
      description,
      start_time,
      end_time,
      duration: durationTime,
      location_lat,
      location_lng,
      user_uuid: req.user.uuid
    })

    res.status(201).json({
      status: 'success',
      message: 'Activity created',
      data: {
        activity
      }
    })
  }
)

const getAllActivities = asyncErrorHandler(
  async (req, res, next) => {
    const { description, sortBy, lat, lng } = req.query
    let activities

    const whereConditions = {
      user_uuid: req.user.uuid
    }

    if(description){
      whereConditions.description = {[Op.iLike]: `%${description}%`}
    }

    if(sortBy === 'distance' && lat && lng) {
      const userLocation = { 
        latitude: parseFloat(lat), 
        longitude: parseFloat(lng)
      }

      const allActivities = await Activity.findAll({
        where: whereConditions
      })

      activities = allActivities.map(activity => {
        const activityLocation = {
          latitude: activity.location_lat,
          longitude: activity.location_lng
        }

        const distance = haversine(userLocation, activityLocation)

        return {
          ...activity.toJSON(),
          distance
        }
      }).sort(
        (a, b) => a.distance - b.distance
      )
    }

    else {
      const queryOptions = { where: whereConditions };

      if (sortBy === 'latest') {
        queryOptions.order = [['createdAt', 'DESC']];
      }

      activities = await Activity.findAll(queryOptions);
    }

    if(activities.length === 0){
      return next(new errorCustom('No post found!', 404))
    }

    res.status(200).json({
      status: 'success',
      message: 'Fetch All Activity',
      length: activities.length,
      data: {
        activities
      }
    })
  }
)

// 
  // GET http://localhost:8383/api/v1/activity/search?description=YOUR_DESCRIPTION

// const searchActivity = asyncErrorHandler(
//   async(req, res, next) => {
//     const { description } = req.query

//     const activities = await Activity.findAll({
//       where: {
//         description: {
//           [Op.iLike]: `%${description}%`
//         },
//         user_uuid: req.user.uuid
//       }
//     })

//     if(activities.length === 0){
//       return next(new errorCustom('No post found!', 404))
//     }

//     res.status(200).json({
//       status: 'success',
//       message: 'Activity found',
//       length: activities.length,
//       data: {
//         activities
//       }
//     })
//   }
// )

// const filterActivity = asyncErrorHandler(
//   async(req, res, next) => {
//     const { sortBy, lat, lng } = req.query
//     console.log({ sortBy, lat, lng }); 
//     let activities;

//     if(sortBy === 'latest') {
//       activities = await Activity.findAll({
//         where: {
//           user_uuid: req.user.uuid
//         },
//         order: [['createdAt', 'DESC']]
//       })
//     }
    
//     /*
//       untuk frontend pake GEOLOCATION

//       GET /filter?sortBy=latest

//       GET /filter?sortBy=distance&lat=YOUR_LATITUDE&lng=YOUR_LONGITUDE
//     */  

//     else if(sortBy === 'distance' && lat && lng) {
//       const userLocation = { 
//         latitude: parseFloat(lat), 
//         longitude: parseFloat(lng)
//       }

//       const allActivities = await Activity.findAll({
//         where: {
//           user_uuid: req.user.uuid
//         }
//       })

//       activities = allActivities.map(activity => {
//         const activityLocation = {
//           latitude: activity.location_lat,
//           longitude: activity.location_lng
//         }

//         const distance = haversine(userLocation, activityLocation)

//         return {
//           ...activity.toJSON(),
//           distance
//         }
//       }).sort(
//         (a, b) => a.distance - b.distance
//       )
//     }

//     else {
//       return next(
//         new errorCustom('Invalid sortBy parameter. Use "latest" or "distance".', 400)
//       )
//     }

//     res.status(200).json({
//       status: 'success',
//       message: 'Fetch All Activity',
//       length: activities.length,
//       data: {
//         activities
//       }
//     })
//   }
// )

const getSingleActivity = asyncErrorHandler(
  async (req, res, next) => {
    const activity = await Activity.findByPk(req.params.uuid)

    if(!activity){
      return next(new errorCustom('No post found!', 404))
    }

    res.status(200).json({
      status: 'success',
      message: 'Get A Activity',
      activity
    })
  }
)

const updateActivity = asyncErrorHandler(
  async(req, res ,next) => {

    const uuid = req.params.uuid
    const updateData = req.body;

    const activity = await Activity.findByPk(uuid)

    if(!activity){
      return next(new errorCustom('No post found!', 404))
    }

    if(updateData.start_time || updateData.end_time){

      const startTime = updateData.start_time ? moment(updateData.start_time) : moment(activity.start_time)
      const endTime = updateData.end_time ? moment(updateData.end_time) : moment(activity.end_time)
      updateData.duration = endTime.diff(startTime, 'seconds')

    }

    await activity.update(updateData)
    
    res.status(201).json({
      status: 'success',
      message: 'Activity updated',
      activity
    })
    
  }
)

const deleteActivity = asyncErrorHandler(
  async (req, res, next) => {
    const activity = await Activity.findByPk(req.params.uuid)

    if(!activity){
      return next(new errorCustom('No post found!', 404))
    }

    await activity.destroy()

    res.status(200).json({
      status: 'success',
      message: 'Activity Deleted',
    })
  }
)

module.exports = {
  createActivity,
  getAllActivities,
  getSingleActivity,
  // searchActivity,
  // filterActivity,
  updateActivity,
  deleteActivity,
}