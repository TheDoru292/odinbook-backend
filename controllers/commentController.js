const comment = require("../models/comment");
const { body, validationResult } = require("express-validator");
const ErrorHandler = require("../lib/ErrorHandler");

exports.get = (req, res) => {
  comment.find({ _id: req.params.commentId }, (err, comment) => {
    if (err) {
      const Error = new ErrorHandler(err, 500);
      return res.status(Error.errCode).json(Error.error);
    }

    return res.status(200).json({ success: true, comment });
  });
};

exports.getAllPostComments = (req, res) => {
  comment.find({ post: req.params.postId }, (err, comments) => {
    if (err) {
      const Error = new ErrorHandler(err, 500);
      return res.status(Error.errCode).json(Error.error);
    }

    return res.status(200).json({ success: true, comments });
  });
};

exports.post = [
  body("content").isLength({ min: 1 }).trim().escape(),

  (req, res) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      const Error = new ErrorHandler(
        null,
        400,
        "Check errors",
        validationErrors.array()
      );
      return res.status(Error.errCode).json(Error.error);
    }

    const commentObj = {
      user: req.user._id,
      post: req.params.postId,
      content: req.body.content,
      commented_on: new Date(),
    };

    comment.create(commentObj, (err, comment) => {
      if (err) {
        const Error = new ErrorHandler(err, 500);
        return res.status(Error.errCode).json(Error.error);
      }

      return res.status(200).json({ success: true, comment });
    });
  },
];

exports.editComment = [
  body("content").isLength({ min: 1 }).trim().escape(),

  (req, res) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
      const Error = new ErrorHandler(
        null,
        400,
        "Check errors",
        validationErrors.array()
      );
      return res.status(Error.errCode).json(Error.error);
    }

    const commentObj = {
      _id: req.params.commentId,
      content: req.body.content,
    };

    comment.updateOne(
      { _id: req.params.commentId },
      commentObj,
      (err, comment) => {
        if (err) {
          const Error = new ErrorHandler(err, 500);
          return res.status(Error.errCode).json(Error.error);
        }

        return res.status(200).json({ success: true, comment });
      }
    );
  },
];

exports.delete = (req, res) => {
  comment.deleteOne({ _id: req.params.commentId }, (err, comment) => {
    if (err) {
      const Error = new ErrorHandler(err, 500);
      return res.status(Error.errCode).json(Error.error);
    }

    return res.status(200).json({ success: true, status: "Comment deleted." });
  });
};
