const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  url_handle: { type: String, required: true, unique: true },
  profile_picture_url: { type: String, required: true },
  registered_on: { type: Date, required: true },
});

module.exports = mongoose.model("User", UserSchema);
