'use strict';

const { v4: uuidv4 } = require('uuid')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('activities', [
      {
        uuid: uuidv4(),
        user_uuid: uuidv4(),
        description: 'Morning Standup Meeting',
        start_time: new Date('2025-03-10T09:00:00Z'),
        end_time: new Date('2025-03-10T09:30:00Z'),
        duration: 30,
        location_lat: -6.200000,
        location_lng: 106.816666,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        uuid: uuidv4(),
        user_uuid: uuidv4(),
        description: 'Lunch Break',
        start_time: new Date('2025-03-10T12:00:00Z'),
        end_time: new Date('2025-03-10T13:00:00Z'),
        duration: 60,
        location_lat: -6.201000,
        location_lng: 106.817000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('activities', null, {});
  }
};
