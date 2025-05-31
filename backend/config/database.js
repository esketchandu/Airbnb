const config = require('./index');

module.exports = {
  development: {
    storage: config.dbFile,
    dialect: "sqlite",
    seederStorage: "sequelize",
    logQueryParameters: true,
    typeValidation: true
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    seederStorage: 'sequelize',
    seederStoragePath: 'db/seeders',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      },
      searchPath: ['airbnb_schema', 'public'] // added it to resolve the issue pn Render
    },
    define: {
      schema: process.env.SCHEMA || 'airbnb_schema'
    }
  }
};
