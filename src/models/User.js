'use strict';
const {
  Model
} = require('sequelize');

const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate({Activity}) {
      this.hasMany(Activity, {foreignKey: 'user_uuid', as: 'activities'})
    }

    //Instance methods
    createResetPasswordToken(){     
      const resetToken = crypto.randomBytes(32).toString('hex')
      
      this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
      this.passwordResetTokenExpires = new Date(Date.now() + 10 * 60 * 1000);

      console.log(resetToken, this.passwordResetToken);
      return resetToken;
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
    passwordResetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    passwordResetTokenExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    passwordChangedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'users',
    modelName: 'User',
    timestamps: true,
  });

  return User;
};