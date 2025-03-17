'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.addColumn('users', 'passwordResetToken',{
      type: DataTypes.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'passwordResetTokenExpires',{
      type: DataTypes.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'passwordChangedAt',{
      type: DataTypes.DATE,
      allowNull: true,
    });
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.removeColumn('users', 'passwordResetToken');
    await queryInterface.removeColumn('users', 'passwordResetTokenExpires');
    await queryInterface.removeColumn('users', 'passwordChangedAt');
  }
};
