module.exports = {
  development: {
    username: process.env.CONFIG_USERNAME,
    password: process.env.CONFIG_PASSWORD,
    database: process.env.CONFIG_DB,
    host: process.env.CONFIG_HOST,
    dialect: 'postgres',
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  production: {
    use_env_variable: process.env.DB_URL,
    dialect: 'postgres'
  }
}