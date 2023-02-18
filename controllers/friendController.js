const friend = require("../models/friend");
const friendReq = require("../models/friendReq");
const ErrorHandler = require("../lib/ErrorHandler");

exports.post = (req, res) => {
  const friendReqObj = {
    sender: req.user._id,
    recipient: req.params.userId,
    sent_on: new Date(),
  };

  friendReq.create(friendReqObj, (err, friendReq) => {
    if (err) {
      const Error = new ErrorHandler(err, 500);
      return res.status(Error.errCode).json(Error.error);
    }

    return res.status(200).json({ success: true, friendReq });
  });
};
