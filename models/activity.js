'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Activity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User}) {
      this.belongsTo(User, {foreignKey: 'user_uuid', as: 'user'})
    }
  }
  Activity.init({
    uuid:{
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull: { msg: 'Field must be filled'},
        notEmpty: { msg: 'Field must not empty'}
      }
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    location_lat: {
      type: DataTypes.FLOAT(50),
      allowNull: false,
    },
    location_lng: {
      type: DataTypes.FLOAT(50),
      allowNull: false,
    },
    
  }, {
    sequelize,
    tableName: 'activities',
    modelName: 'Activity',
    timestamps: true,
  });
  return Activity;
};