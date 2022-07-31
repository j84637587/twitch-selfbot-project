const router = require("express").Router();
const Channel = require("../models/channel");
const { check, validationResult } = require("express-validator");

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
    });
});

// @route   Post /
// @desc    Create an new channel
// @access  Public
router.post("/channel", [
  check("channel_id", "Channel ID field is required").notEmpty()
], (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ success: false, errors: errors.array() });
    }

    let nc = new Channel(
      {
        channel_id: req.body.channel_id,
        enable: true,
        emoji: "hanayu5Shebao",
        regexes: [],
        spam: []
      }
    );

    for (let i = 0; i < req.body.regex.length; i++) { 
      nc.regexes.push({
        enable: req.body.regexEnable[i],
        regex: req.body.regex[i],
        response: req.body.response[i]
      })
    }

    for (let i = 0; i < req.body.cycle.length; i++) { 
      nc.spam.push({
        enable: req.body.spamEnable[i],
        cycle: req.body.cycle[i],
        message: req.body.message[i]
      })
    }

    nc.save();
    return res.json({ success: true })
  } catch (error) {
    console.log(error);
  }
});

// @route   Delete /channel/:_id
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
      });
  }
});

module.exports = router;
