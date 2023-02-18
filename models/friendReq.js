const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FriendRequestSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
  sent_on: { type: Date, required: true },
});

module.exports = mongoose.model("FriendReq", FriendRequestSchema);
