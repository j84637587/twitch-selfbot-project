const router = require("express").Router();
const Channel = require("../models/channel");

// @route   Get /
// @desc    Get an array of all the users
// @access  Public
router.get("/", (req, res) => {
  Channel.find()
    .then((channels) => {
      res.render("index", {
        channels: channels,
      });
    })
    .catch((err) => {
      console.log(err);
    })
});

router.get("/channel/:id/edit", (req, res) => {
  try {
    var id = req.params.chid; // channel id
    Channel.find({ _id: id }, (err, channel, count) => {
      if (err) throw err;
      console.log(channel)
    });
  } catch (error) {
    console.log(error);
  }
});

// @route   Delete /
// @desc    Delete an record by record object id
// @access  Public
router.delete("/channel/:_id", (req, res) => {
  const _id = req.params._id; // channel id
  const deleted = Channel.findById(_id);
  if (deleted) {
    Channel.deleteOne({ _id })
      .then(() => {
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
        res.status(404).json({ message: "Channel is not exist!" });
      })
  }
});

module.exports = router;
