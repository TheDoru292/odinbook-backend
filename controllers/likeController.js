const like = require("../models/like");
const ErrorHandler = require("../lib/ErrorHandler");

exports.post = (req, res) => {
  if (req.liked === true) {
    like.findOneAndDelete(
      { user: req.user._id, post: req.params.postId },
      (err, like) => {
        if (err) {
          const Error = new ErrorHandler(err, 500);
          return res.status(Error.errCode).json(Error.error);
        }

        return res.status(200).json({ success: true, status: "Removed like." });
      }
    );
  } else if (req.liked === false) {
    const likeObj = {
      user: req.user._id,
      post: req.params.postId,
    };

    like.create(likeObj, (err, like) => {
      if (err) {
        const Error = new ErrorHandler(err, 500);
        return res.status(Error.errCode).json(Error.error);
      }

      return res.status(200).json({ success: true, like });
    });
  } else {
    return res.status(500).json({
      success: false,
      status: "Internal server error - Something went wrong.",
    });
  }
};
