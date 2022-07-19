const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commandSchema = new Schema({
  command: String,
  response: String,
});

const regexSchema = new Schema({
  regex: String,
  regex_modifier: String,
  response: String,
});

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
  commands: [ commandSchema ],
  regexs: [ regexSchema ],
  spam: {
    enable: {
      type: Boolean,
      required: true,
    },
    cycle: {
      type: Number,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
});

module.exports = Channel = mongoose.model("channel", channelSchema);