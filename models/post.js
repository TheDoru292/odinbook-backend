const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  posted_on: { type: Date, required: true },
});

PostSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Post", PostSchema);
