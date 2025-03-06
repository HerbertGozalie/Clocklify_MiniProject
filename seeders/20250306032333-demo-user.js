'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
      await queryInterface.bulkInsert('users', [{
        uuid: 'f5893602-0db6-458c-bd43-a07dfb19862f',
        email: 'JohnDoe@gmail.com',
        password: "12345678",
        verified: 'not verified',
        createdAt: new Date(),
      }], {});
    
  },

  async down (queryInterface, Sequelize) {
    
  
      await queryInterface.bulkDelete('users', null, {}); 
  }
};
