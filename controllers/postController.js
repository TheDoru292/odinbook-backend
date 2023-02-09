const { body, validationResult } = require("express-validator");
const post = require("../models/post");

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
        return res.status(500).json({
          success: false,
          code: 500,
          status: "Internal server error",
        });
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
      return res.status(400).json({
        success: false,
        code: 400,
        status: "Check errors",
        errors: errors.array(),
      });
    }

    const postObj = {
      user: req.user._id,
      content: req.body.content,
      posted_on: new Date(),
    };

    post.create(postObj, (err, post) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ success: false, code: 500, status: "Internal server error" });
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
      return res.status(400).json({
        success: false,
        code: 400,
        status: "Check errors",
        errors: errors.array(),
      });
    }

    post.findOneAndUpdate({ _id: req.params.postId }, (err, post) => {
      if (err) {
        return res
          .status(400)
          .json({ success: false, code: 500, status: "Internal server error" });
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
      return res
        .status(400)
        .json({ success: false, code: 500, status: "Internal server error" });
    }

    return res.status(200).json({ success: true, status: "Post deleted" });
  });
};
