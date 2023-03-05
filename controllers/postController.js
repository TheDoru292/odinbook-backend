const { body, validationResult } = require("express-validator");
const post = require("../models/post");
const ErrorHandler = require("../lib/ErrorHandler");
const async = require("async");
const like = require("../models/like");
const comment = require("../models/comment");

exports.get = (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  post.paginate(
    {},
    {
      page,
      limit,
      select: "_id",
    },
    (err, posts) => {
      if (err) {
        const Error = new ErrorHandler(err, 500);
        return res.status(Error.errCode).json(Error.error);
      }

      const array = [];

      async.forEach(
        posts.docs,
        (document, callback) => {
          post
            .findOne({ _id: document._id })
            .populate("user", "-email -password")
            .exec((err, post) => {
              if (err) {
                callback(err);
              }

              like.countDocuments({ post: post._id }, (err, likes) => {
                if (err) {
                  callback(err);
                }

                like.findOne(
                  { user: req.user._id, post: post._id },
                  (err, like) => {
                    if (err) {
                      callback(err);
                    }

                    comment
                      .find({ post: post._id })
                      .populate(
                        "user",
                        "username url_handle profile_picture_url"
                      )
                      .exec((err, comments) => {
                        if (err) {
                          callback(err);
                        }

                        const obj = {
                          post: post,
                          likes: {
                            count: likes,
                          },
                          liked: like == null ? false : true,
                          comments,
                        };

                        array.push(obj);

                        callback();
                      });
                  }
                );
              });
            });
        },
        function (err) {
          if (err) {
            const Error = new ErrorHandler(err, 500);
            return res.status(Error.errCode).json(Error.error);
          }
          return res.json({ success: true, posts: array });
        }
      );
    }
  );
};

exports.getOne = (req, res) => {
  post.findOne({ _id: req.params.postId }, (err, post) => {
    if (err) {
      const Error = new ErrorHandler(err, 500);
      return res.status(Error.errCode).json(Error.error);
    }

    if (!post) {
      const Error = new ErrorHandler(err, 404, "Post not found");
      return res.status(Error.errCode).json(Error.error);
    }

    return res.status(200).json({ success: true, post });
  });
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
    console.log("hi");

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const Error = new ErrorHandler(null, 400, "Check errors", errors.array());
      return res.status(Error.errCode).json(Error.error);
    }

    post.findOneAndUpdate(
      { _id: req.params.postId },
      { content: req.body.content },
      (err, post) => {
        if (err) {
          const Error = new ErrorHandler(err, 500);
          return res.status(Error.errCode).json(Error.error);
        }

        if (String(post.user._id) != String(req.user._id)) {
          const Error = new ErrorHandler(err, 403);
          return res.status(Error.errCode).json(Error.error);
        }

        return res
          .status(200)
          .json({ success: true, status: "Post succcessfully edited." });
      }
    );
  },
];

exports.delete = (req, res) => {
  async.parallel(
    {
      post: function (callback) {
        post.findOneAndDelete({ _id: req.params.postId }, (err, post) => {
          if (err) {
            callback(err);
          }

          callback(null, "Post deleted.");
        });
      },
      comments: function (callback) {
        comment.deleteMany({ post: req.params.postId }, (err, comments) => {
          if (err) {
            callback(err);
          }

          callback(null, "Comments deleted.");
        });
      },
      likes: function (callback) {
        like.deleteMany({ post: req.params.postId }, (err, likes) => {
          if (err) {
            callback(err);
          }

          callback(null, "Likes deleted");
        });
      },
    },
    function (err, results) {
      if (err) {
        const Error = new ErrorHandler(err, 500);
        return res.status(Error.errCode).json(Error.error);
      }

      return res.status(200).json({ success: true, results });
    }
  );
};

exports.getUserPosts = (req, res) => {
  post.find({ user: req.params.userId }, "_id", (err, posts) => {
    if (err) {
      const Error = new ErrorHandler(err, 500);
      return res.status(Error.errCode).json(Error.error);
    }

    array = [];

    async.forEach(
      posts,
      (document, callback) => {
        post
          .findOne({ _id: document._id })
          .populate("user", "-email -password")
          .exec((err, post) => {
            if (err) {
              callback(err);
            }

            like.countDocuments({ post: post._id }, (err, likes) => {
              if (err) {
                callback(err);
              }

              like.findOne(
                { user: req.user._id, post: post._id },
                (err, like) => {
                  if (err) {
                    callback(err);
                  }

                  comment
                    .find({ post: post._id })
                    .populate("user", "username url_handle profile_picture_url")
                    .exec((err, comments) => {
                      if (err) {
                        callback(err);
                      }

                      const obj = {
                        post: post,
                        likes: {
                          count: likes,
                        },
                        liked: like == null ? false : true,
                        comments,
                      };

                      array.push(obj);

                      callback();
                    });
                }
              );
            });
          });
      },
      function (err) {
        if (err) {
          const Error = new ErrorHandler(err, 500);
          return res.status(Error.errCode).json(Error.error);
        }
        return res.json({ success: true, posts: array });
      }
    );
  });
};
