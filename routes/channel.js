const router = require("express").Router();
const Channel = require("../models/channel");

// @route   Get /
// @desc    Get an array of all the users
// @access  Public
router.get("/", (req, res) => {
  try {
    Channel.find((err, channels, count) => {
      if(err) throw err;
      res.render("index", {
        channels: channels,
      });
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/channel/:id/edit", (req, res) => {
  try {
    var id = req.params.chid; // channel id
    Channel.find({_id: id}, (err, channel, count) => {
      if(err) throw err;
      console.log(channel)
      // res.render("edit", {
      //   channels: channels,
      // });
    });
  } catch (error) {
    console.log(error);
  }
});

router.delete("/channel/:id", (req, res) => {
  try {
    var id = req.params.id; // channel id
    console.log(id);
    Channel.remove({_id: id}, (err, res) => {
      if(err) throw err;
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
