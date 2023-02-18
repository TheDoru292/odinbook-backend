const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FriendSchema = new Schema({
  first_user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  second_user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  friends_since: { type: Date, required: true },
});

module.exports = mongoose.model("Friend", FriendSchema);
