const express = require("express");
const router = express.Router();
const HomeController = require("../app/controllers/HomeController");
const AuthController = require("../app/controllers/AuthController");
const PlayersController = require("../app/controllers/PlayersController");

router.get("/", HomeController.homePage);
router.get("/login", AuthController.loginPage);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);
router.get("/sign-up", AuthController.signUpPage);
router.post("/sign-up", AuthController.signUp);
router.get("/forgot-password", AuthController.forgotPasswordPage);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/create-scavenger", HomeController.createScavenger);
router.post("/get-scavenger", HomeController.getScavenger);
router.post("/get-scavenger-card-qr", HomeController.getCardQRCode);
router.post("/create-player", PlayersController.createPlayer);
router.post("/add-player-card", PlayersController.addPlayerCards);
router.post("/get-player", PlayersController.getPlayer);

module.exports = router;
