const Sequelize = require("sequelize");
const env = require("dotenv");
env.config();

// const DB_HOST = process.env.DB_HOST
// const DB_PORT = process.env.DB_PORT
// const DB_DATABASE = process.env.DB_DATABASE
// const DB_USERNAME = process.env.DB_USERNAME
// const DB_PASSWORD = process.env.DB_PASSWORD

const DB_HOST = "db4free.net";
const DB_PORT = 3306;
const DB_DATABASE = "scavenger_hunt";
const DB_USERNAME = "scavenger_hunt";
const DB_PASSWORD = "ScavengerHunt";

const sequelize = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
  dialect: "mysql",
  host: DB_HOST,
});

module.exports = sequelize;
