const { body, validationResult } = require("express-validator");
const post = require("../models/post");
const ErrorHandler = require("../lib/ErrorHandler");

exports.get = (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  post.paginate(
    {},
    {
      page,
      limit,
    },
    (err, posts) => {
      if (err) {
        const Error = new ErrorHandler(err, 500);
        return res.status(Error.errCode).json(Error.error);
      }

      return res.json({ success: true, posts });
    }
  );
};

exports.create = [
  body("content").isLength({ min: 1 }).trim().escape(),

  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const Error = new ErrorHandler(null, 400, "Check errors", errors.array());
      return res.status(Error.errCode).json(Error.error);
    }

    const postObj = {
      user: req.user._id,
      content: req.body.content,
      posted_on: new Date(),
    };

    post.create(postObj, (err, post) => {
      if (err) {
        const Error = new ErrorHandler(err, 500);
        return res.status(Error.errCode).json(Error.error);
      }

      return res.status(200).json({ success: true, post });
    });
  },
];

exports.edit = [
  body("content").isLength({ min: 1 }).trim(),

  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const Error = new ErrorHandler(null, 400, "Check errors", errors.array());
      return res.status(Error.errCode).json(Error.error);
    }

    post.findOneAndUpdate({ _id: req.params.postId }, (err, post) => {
      if (err) {
        const Error = new ErrorHandler(err, 500);
        return res.status(Error.errCode).json(Error.error);
      }

      return res
        .status(200)
        .json({ success: true, status: "Post succcessfully edited." });
    });
  },
];

exports.delete = (req, res) => {
  post.findOneAndDelete(req.params.postId, (err, post) => {
    if (err) {
      const Error = new ErrorHandler(err, 500);
      return res.status(Error.errCode).json(Error.error);
    }

    return res.status(200).json({ success: true, status: "Post deleted" });
  });
};
