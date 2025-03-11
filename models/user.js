'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Activity}) {
      this.hasMany(Activity, {foreignKey: 'user_uuid', as: 'activities'})
    }
  }
  User.init({
    uuid:{
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate:{
        notNull: { msg: 'Field must be filled'},
        notEmpty: { msg: 'Field must not empty'},
        isEmail: { msg: 'Must be a valid email address'}
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull: { msg: 'Field must be filled'},
        notEmpty: { msg: 'Field must not empty'},
        len: {
          args: [8,],
          msg: 'Password must be at least 8 characters long'
        }
      }
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    emailToken: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    tableName: 'users',
    modelName: 'User',
    timestamps: true,
  });
  return User;
};