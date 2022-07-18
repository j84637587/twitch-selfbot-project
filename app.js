const tmi = require("tmi.js");
const config = require("config");

const channels = config.get("CHANNELS");
const spam_channels = config.get("SPAM_CHANNELS");
const channel_ids = Object.keys(channels);
let RegExps = {};

const client = new tmi.Client({
  options: {
    debug: false,
  },
  connection: {
    reconnect: true,
  },
  identity: {
    username: config.get("USERNAME"),
    password: config.get("PASSWORD"),
  },
  channels: channel_ids,
});

client.on("connected", (adress, port) => {
  console.log("\u001b[32mself-bot 啟動!\u001b[0m");

  // init
  this.init();

  // spam interval
  let spamIntervalID = setInterval(sendEmoji, 3 * 61 * 1_000);
});

/**
 * Init regex data
 */
module.exports.init = function () {
  for (const ch in channels) {
    if (!channels[ch].hasOwnProperty("extra")) continue;
    for (const e in channels[ch]["extra"]) {
      // make sure to create obj befor set property
      if (!RegExps.hasOwnProperty(ch)) {
        RegExps[ch] = {};
      }
      RegExps[ch][e] = new RegExp(
        channels[ch]["extra"][e]["regex"],
        channels[ch]["extra"][e]["regex_modifier"]
      );
    }
  }
}

/**
 * Send emote to certain channel
 */
function sendEmoji() {
  console.log("\u001b[32mSend Emote\u001b[0m");
  // client.say("#aaaaalice425", "aaaaal1Heart ");
}

client.on("message", async (channel, tags, message, self) => {
  // console.log(message); // this would print all message we recevice
  for (const ch in channels) {
    if (channel.substring(1) == ch) {
      let response = this.matchMessage(ch, message);

      if (response != "") {
        if (channels[ch]["response"] == true) {
          client.say(channel, response);
          console.log(`\u001b[32m${ch}: ${response}\u001b[0m`);
        } else {
          console.log(`\u001b[31m${ch}: ${response}\u001b[0m`);
        }
      }
      break;
    }
  }
});

/**
 * Match message by channel's regex which was config with default.json
 * and return response message.
 * 
 * @param {string} channel  Which channel's regex 
 * @param {string} message  Message to match
 * @returns 
 */
module.exports.matchMessage = function (channel, message) {
  for (const e in RegExps[channel]) {
    // regex match
    let match = RegExps[channel][e].exec(message);
    if (match == null) continue;

    // get last valid match group
    let index = match.length;
    while (index-- && !match[index]);
    if (index == -1) continue;

    // make response
    let response = channels[channel]["extra"][e]["response"];
    // console.log(">", channel, channels[channel], channels[channel]["extra"], channels[channel]["extra"][e])
    response = response.replace("%username%", match[index]);
    response = response.replace("%emote_here%", channels[channel]["emoji"]);
    return response;
  }
  return "";
}

client.on("cheer", (channel, userstate, message) => {
  let bits_count = ~~userstate["bits"];
  console.log(`\u001b[33m ${userstate["display-name"]} cheer with ${bits_count} bits. \u001b[0m`); // print bits amount
  let response = `@${userstate["display-name"]} 感謝小奇點 %emote_here% `;

  // add extra message when reach specific amount of bits
  if (bits_count >= 500) {
    response += "777";
  }
  sayFormatResponse(channel, response);
});

client.on("raided", (channel, username, viewers) => {
  let response = `@${username} 感謝揪團 %emote_here% 各位可以點擊主播的頭像兩下或是F5降落喔~ 觀眾也可以去追隨 @${username} 喔!`;
  sayFormatResponse(channel, response);
});

client.on(
  "subgift",
  (channel, username, streakMonths, recipient, methods, userstate) => {
    console.log(`${recipient}`);
    console.log(`${userstate}`);
    let response = `@${username} 感謝贈送訂閱 %emote_here% `;
    sayFormatResponse(channel, response);
  }
);

client.on("subscription", (channel, username, method, message, userstate) => {
  let response = `@${username} 感謝訂閱 %emote_here% `;
  sayFormatResponse(channel, response);
});

client.on("resub", (channel, username, method, message, userstate) => {
  let response = `@${username} 感謝訂閱 %emote_here% `;
  sayFormatResponse(channel, response);
});

/**
 * Formate response and send to channel.
 * 
 * @param {string} channel   Channel to send
 * @param {string} response  Response message
 */
function sayFormatResponse(channel, response) {
  for (const ch in channels) {
    // console.log(ch, channels[ch], channel.substring(1))
    if (channel.substring(1) == ch) {
      response = response.replace("%emote_here%", channels[ch]["emoji"]);
      if (channels[ch]["response"] == true) {
        setTimeout(function () {
          client.say(channel, response);
        }, 5 * 1_000);
        console.log(`\u001b[32m${ch}: ${response}\u001b[0m`);
      } else {
        console.log(`\u001b[31m${ch}: ${response}\u001b[0m`);
      }
      break;
    }
  }
}

client.connect();