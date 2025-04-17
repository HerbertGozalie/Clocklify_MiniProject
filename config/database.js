const { Sequelize } = require('sequelize');

  const sequelize = new Sequelize('postgres','Habe!23Habe','postgres',{
    dialect: 'postgres',
    host: 'db.daszzhywitdvplpzzuke.supabase.co',
  });

  module.exports = sequelize;