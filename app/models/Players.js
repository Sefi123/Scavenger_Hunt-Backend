const bcrypt = require("bcryptjs");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Players = sequelize.define("players", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  fullName: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cards: DataTypes.JSON,
  total_cards: DataTypes.INTEGER,
});

module.exports = Players;
