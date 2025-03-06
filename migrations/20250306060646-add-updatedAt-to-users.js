'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.addColumn('users', 'updatedAt', {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.literal("CURRENT_TIMESTAMP"),
    });
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.removeColumn('users', 'updatedAt');
  }
};
