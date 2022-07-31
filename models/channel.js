const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const regexSchema = new Schema({
  enable: {
    type: Boolean,
    default: false
  },
  regex: String,
  regex_modifier: {
    type: String,
    default: "m"
  },
  response: String,
});

const spamSchema = new Schema({
  enable: {
    type: Boolean,
    default: false
  },
  cycle: Number,
  message: String,
})

const channelSchema = new Schema({
  channel_id: {
    type: String,
    required: true,
    trim: true,
  },
  enable: {
    type: Boolean,
    required: true,
  },
  emoji: {
    type: String,
    required: true,
    default: "",
  },
  regexes: [ regexSchema ],
  spam: [ spamSchema ],
});

module.exports = Channel = mongoose.model("channel", channelSchema);