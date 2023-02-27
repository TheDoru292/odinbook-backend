const friend = require("../models/friend");
const friendReq = require("../models/friendReq");
const async = require("async");
const ErrorHandler = require("../lib/ErrorHandler");
const mongoose = require("mongoose");

exports.getUserFriends = (req, res) => {
  friend
    .find({ first_user: req.params.userId })
    .populate("second_user", "username url_handle profile_picture_url")
    .exec((err, friends) => {
      if (err) {
        const Error = new ErrorHandler(err, 500);
        return res.status(Error.errCode).json(Error.error);
      }

      return res.status(200).json({ success: true, friends });
    });
};

exports.post = (req, res) => {
  const friendReqObj = {
    sender: req.user._id,
    recipient: req.params.userId,
    sent_on: new Date(),
  };

  friendReq.create(friendReqObj, (err, friendReqObj) => {
    if (err) {
      const Error = new ErrorHandler(err, 500);
      return res.status(Error.errCode).json(Error.error);
    }

    friendReq
      .findOne({ _id: friendReqObj._id })
      .populate("recipient", "username url_handle profile_picture_url")
      .exec((err, friend) => {
        if (err) {
          const Error = new ErrorHandler(err, 500);
          return res.status(Error.errCode).json(Error.error);
        }

        return res.status(200).json({ success: true, friendReq: friend });
      });
  });
};

exports.getFriendRequests = (req, res) => {
  friendReq
    .find({ recipient: req.params.userId })
    .populate("sender", "username url_handle profile_picture_url")
    .exec((err, friendReqs) => {
      if (err) {
        const Error = new ErrorHandler(err, 500);
        return res.status(Error.errCode).json(Error.error);
      }

      return res.status(200).json({ success: true, friendReqs });
    });
};

exports.acceptFriendRequest = (req, res) => {
  friendReq.findOne({ _id: req.params.requestId }, (err, friendReqDone) => {
    if (err) {
      const Error = new ErrorHandler(err, 500);
      return res.status(Error.errCode).json(Error.error);
    }

    async.waterfall(
      [
        function (callback) {
          const friendObj = {
            first_user: friendReqDone.sender,
            second_user: friendReqDone.recipient,
            friends_since: new Date(),
          };

          friend.create(friendObj, (err, friendDone) => {
            if (err) {
              callback(err);
            }

            callback(null, friendDone);
          });
        },
        function (arg1, callback) {
          const friendObj = {
            first_user: friendReqDone.recipient,
            second_user: friendReqDone.sender,
            friends_since: new Date(),
          };

          friend.create(friendObj, (err, friendDone) => {
            if (err) {
              callback(err);
            }

            callback(null, friendDone);
          });
        },
      ],
      function (err, results) {
        if (err) {
          const Error = new ErrorHandler(err, 500);
          return res.status(Error.errCode).json(Error.error);
        }

        friendReq.findOneAndDelete(
          { _id: req.params.requestId },
          (err, deleted) => {
            if (err) {
              const Error = new ErrorHandler(err, 500);
              return res.status(Error.errCode).json(Error.error);
            }

            return res
              .status(200)
              .json({ success: true, status: "You are now friends!" });
          }
        );
      }
    );
  });
};

exports.deleteFriendRequest = (req, res) => {
  friendReq.findOneAndDelete({ _id: req.params.requestId }, (err, request) => {
    if (err) {
      const Error = new ErrorHandler(err, 500);
      return res.status(Error.errCode).json(Error.error);
    }

    return res
      .status(200)
      .json({ success: true, status: "Friend request denied." });
  });
};

exports.getOutgoingFriendRequests = (req, res) => {
  friendReq
    .find({ sender: req.params.userId })
    .populate("recipient", "username url_handle profile_picture_url")
    .exec((err, friendReqs) => {
      if (err) {
        const Error = new ErrorHandler(err, 500);
        return res.status(Error.errCode).json(Error.error);
      }

      return res.status(200).json({ success: true, friendReqs });
    });
};

exports.deleteOutgoingFriendRequest = (req, res) => {
  friendReq.findByIdAndDelete(
    { _id: req.params.requestId },
    (err, friendReq) => {
      if (err) {
        const Error = new ErrorHandler(err, 500);
        return res.status(Error.errCode).json(Error.error);
      }

      return res
        .status(200)
        .json({ success: true, status: "Friend request deleted." });
    }
  );
};

exports.removeFriend = (req, res) => {
  async.waterfall(
    [
      function (callback) {
        friend.findOneAndDelete(
          { first_user: req.params.userId, second_user: req.params.friendId },
          (err, friend) => {
            if (err) {
              callback(err);
            }

            callback(null, friend);
          }
        );
      },
      function (arg1, callback) {
        friend.findOneAndDelete(
          { first_user: req.params.friendId, second_user: req.params.userId },
          (err, friend) => {
            if (err) {
              callback(err);
            }

            callback(null, friend);
          }
        );
      },
    ],
    function (err, results) {
      if (err) {
        const Erorr = new ErrorHandler(err, 500);
        return res.status(Error.errCode).json(Error.error);
      }

      return res.status(200).json({ success: true, status: "Friend removed." });
    }
  );
};
