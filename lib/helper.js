const post = require("../models/post");
const async = require("async");
const ErrorHandler = require("./ErrorHandler");

exports.checkSameUserPost = (req, res, next) => {
  post.findOne({ _id: req.params.postId }, (err, post) => {
    if (err) {
      const Error = new ErrorHandler(err, 500);
      return res.status(Error.errCode).json(Error.error);
    }

    console.log("hi");
    console.log(post.user._id, req.user._id);

    if (String(post.user._id) != String(req.user._id)) {
      const Error = new ErrorHandler(err, 403);
      return res.status(Error.errCode).json(Error.error);
    }

    next();
  });
};
