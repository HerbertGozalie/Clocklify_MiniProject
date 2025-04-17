module.exports = {
  development: {
    // username: process.env.CONFIG_DEPLOYMENT_USERNAME,
    // password: process.env.CONFIG_DEPLOYMENT_PASSWORD,
    // database: process.env.CONFIG_DEPLOYMENT_DB,
    // host: process.env.CONFIG_DEPLOYMENT_HOST,
    // dialect: "postgres",
    username: process.env.CONFIG_USERNAME,
    password: process.env.CONFIG_PASSWORD,
    database: process.env.CONFIG_DB,
    host: process.env.CONFIG_HOST,
    dialect: 'postgres',
  },
  production: {
    username: process.env.CONFIG_DEPLOYMENT_USERNAME,
    password: process.env.CONFIG_DEPLOYMENT_PASSWORD,
    database: process.env.CONFIG_DEPLOYMENT_DB,
    host: process.env.CONFIG_DEPLOYMENT_HOST,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    dialectModule: require('pg')
  },
};
