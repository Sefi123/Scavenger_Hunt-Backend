const Scavenger = require("../models/Scavenger");
const bcrypt = require("bcryptjs");

exports.homePage = (req, res, next) => {
  res.render("home");
};

exports.createScavenger = (req, res, next) => {
  console.log("req.body");
  console.log(req.body);

  bcrypt
    .hash(req.body.password, 12)
    .then((hashedPassword) => {
      const scavenger_hunt = new Scavenger({
        title: req.body.title,
        location: req.body.location,
        password: hashedPassword,
        category: req.body.category,
      });
      return scavenger_hunt.save();
    })
    .then((result) => {
      return res
        .status(200)
        .send({ result, message: "Scavenger Hunt successfully created" });
    })
    .catch((err) => console.log(err));
};
