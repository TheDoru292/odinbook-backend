const post = require("../models/post");
const async = require("async");
const ErrorHandler = require("./ErrorHandler");
const user = require("../models/user");
const like = require("../models/like");
const comment = require("../models/comment");
const friendReq = require("../models/friendReq");
const friend = require("../models/friend");

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

exports.checkSameUserComment = (req, res, next) => {
  comment.findOne({ _id: req.params.commentId }, (err, comment) => {
    if (err) {
      const Error = new ErrorHandler(err, 500);
      return res.status(Error.errCode).json(Error.error);
    }

    if (String(req.user._id) != String(comment.user._id)) {
      const Error = new ErrorHandler(err, 403);
      return res.status(Error.errCode).json(Error.error);
    }

    next();
  });
};

exports.checkFriendRequestExists = (req, res, next) => {
  friendReq.findOne(
    { sender: req.user._id, recipient: req.params.userId },
    (err, friendReq) => {
      if (err) {
        const Error = new ErrorHandler(err, 500);
        return res.status(Error.errCode).json(Error.error);
      }

      if (friendReq) {
        const Error = new ErrorHandler(null, 400, "Friend request exists");
        return res.status(Error.errCode).json(Error.error);
      }

      next();
    }
  );
};

exports.checkIfFriends = (req, res, next) => {
  friend.findOne(
    { first_user: req.params.userId, second_user: req.user._id },
    (err, friend) => {
      if (err) {
        const Error = new ErrorHandler(err, 500);
        return res.status(Error.errCode).json(Error.error);
      }

      if (friend) {
        const Error = new ErrorHandler(null, 400, "You are already friends!");
        return res.status(Error.errCode).json(Error.error);
      }

      next();
    }
  );
};

exports.checkSameUserFriend = (req, res, next) => {
  if (String(req.user._id) === String(req.params.userId)) {
    const Error = new ErrorHandler(
      null,
      400,
      "You are trying to friend yourself!"
    );
    return res.status(Error.errCode).json(Error.error);
  }

  next();
};

exports.checkSameUser = (req, res, next) => {
  if (String(req.user._id) === String(req.params.userId)) {
    next();
  } else {
    const Error = new ErrorHandler(null, 403);
    return res.status(Error.errCode).json(Error.error);
  }
};

exports.checkFriendReqById = (req, res, next) => {
  friendReq.findOne({ _id: req.params.requestId }, (err, request) => {
    if (err) {
      const Error = new ErrorHandler(err, 500);
      return res.status(Error.errCode).json(Error.error);
    }

    if (!request) {
      const Error = new ErrorHandler(err, 400, "Request doesn't exist");
      return res.status(Error.errCode).json(Error.error);
    }

    next();
  });
};

exports.checkIfUserFriends = (req, res, next) => {
  friend.findOne(
    { first_user: req.user._id, second_user: req.params.friendId },
    (err, friend) => {
      if (err) {
        const Error = new ErrorHandler(err, 500);
        return res.status(Error.errCode).json(Error.error);
      }

      if (!friend) {
        const Error = new ErrorHandler(err, 400, "You aren't friends!");
        return res.status(Error.errCode).json(Error.error);
      }

      next();
    }
  );
};
