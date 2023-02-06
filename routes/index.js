require("dotenv").config();
var express = require("express");
var router = express.Router();

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_LINK);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const usersRouter = require("./users");
const authRouter = require("./auth");

router.use("/user", usersRouter);

router.use("/auth", authRouter);

module.exports = router;
