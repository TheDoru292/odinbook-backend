const post = require("../models/post");
const async = require("async");
const ErrorHandler = require("./ErrorHandler");
const user = require("../models/user");
const like = require("../models/like");

exports.checkSameUserPost = (req, res, next) => {
  post.findOne({ _id: req.params.postId }, (err, post) => {
    if (err) {
      const Error = new ErrorHandler(err, 500);
      return res.status(Error.errCode).json(Error.error);
    }

    if (String(post.user._id) != String(req.user._id)) {
      const Error = new ErrorHandler(err, 403);
      return res.status(Error.errCode).json(Error.error);
    }

    next();
  });
};

exports.checkIfPostExists = (req, res, next) => {
  post.findOne({ _id: req.params.postId }, (err, post) => {
    if (err) {
      const Error = new ErrorHandler(err, 500);
      return res.status(Error.errCode).json(Error.error);
    }

    if (!post) {
      const Error = new ErrorHandler(err, 404, "Post doesn't exist", undefined);
      return res.status(Error.errCode).json(Error.error);
    }

    next();
  });
};

exports.checkIfUserExists = (req, res, next) => {
  user.findOne({ _id: req.params.userId }, "_id", (err, user) => {
    if (err) {
      const Error = new ErrorHandler(err, 500);
      return res.status(Error.errCode).json(Error.error);
    }

    if (!user) {
      const Error = new ErrorHandler(err, 404, "User doesn't exist");
      return res.status(Error.errCode).json(Error.error);
    }

    next();
  });
};

exports.checkIfLiked = (req, res, next) => {
  like.findOne({ post: req.params.postId, user: req.user._id }, (err, like) => {
    if (err) {
      const Error = new ErrorHandler(err, 500);
      return res.status(Error.errCode).json(Error.error);
    }

    if (!like) {
      req.liked = false;
    } else {
      req.liked = true;
    }

    next();
  });
};
