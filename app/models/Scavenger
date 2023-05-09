const bcrypt = require("bcryptjs");
const { Sequelize, DataTypes, ARRAY } = require("sequelize");
const sequelize = require("../../config/database");

const Scavengers = sequelize.define("scavenger_hunt_game", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: DataTypes.STRING,
  location: DataTypes.STRING,

  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  category: DataTypes.JSON,
  created_by: DataTypes.INTEGER,
});

module.exports = Scavengers;
