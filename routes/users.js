var express = require("express");
var router = express.Router();

const { getUserPosts } = require("../controllers/postController");
const user = require("../controllers/userController");
const { checkIfUserExists } = require("../lib/helper");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/register", user.registerWithEmail);

router.get("/:userId/post", checkIfUserExists, getUserPosts);

module.exports = router;
