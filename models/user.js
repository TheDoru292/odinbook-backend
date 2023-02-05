const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: String,
  email: String,
  password: String,
  url_handle: String,
  profile_picture_url: String,
  registered_on: Date,
});

module.exports = mongoose.model("User", UserSchema);
