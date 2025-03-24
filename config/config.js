module.exports = {
  development: {
    username: process.env.CONFIG_USERNAME,
    password: process.env.CONFIG_PASSWORD,
    database: process.env.CONFIG_DB,
    host: process.env.CONFIG_HOST,
    dialect: "postgres"
  },

}
