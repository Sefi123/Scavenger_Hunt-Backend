const bcrypt = require("bcryptjs");
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Quiz = sequelize.define("quiz_game", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: DataTypes.STRING,
  audio: DataTypes.STRING,
  images: DataTypes.JSON,
  correct: DataTypes.INTEGER,
  selected: DataTypes.INTEGER,
});

module.exports = Quiz;
