const tmi = require("tmi.js");
const config = require("config");
// const express = require('express')
// const app = express()
// const server = require('http').createServer(app);

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
  console.log(`\u001b[32m${getCurrentTimeString()} self-bot 啟動!\u001b[0m`);

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
  console.log(`\u001b[32m${getCurrentTimeString()} Send Emote\u001b[0m`);
  // client.say("#aaaaalice425", "aaaaal1Heart ");
}

client.on("message", async (channel, userstate, message, self) => {
  // console.log(`${getCurrentTimeString()} ${message}`); // this would print all message we recevice
  for (const ch in channels) {
    if (channel.substring(1) == ch) {
      let response = this.matchMessage(ch, message, userstate["username"]);

      // commands
      if (response == "") {
        for (const i in channels[ch]["commands"]) {
          if (message == channels[ch]["commands"][i]["command"]) {
            response = channels[ch]["commands"][i]["response"];
            response = this.replaceUsername(response, userstate["username"]);
          }
        }
      }

      if (response != "") {
        if (channels[ch]["response"] == true) {
          setTimeout(function () {
            client.say(channel, response);
          }, 1 * 1_000);
          console.log(`\u001b[32m${getCurrentTimeString()} ${ch}: ${response}\u001b[0m`);
        } else {
          console.log(`\u001b[31m${getCurrentTimeString()} ${ch}: ${response}\u001b[0m`);
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
module.exports.matchMessage = function (channel, message, un) {
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
    if (index == 0)
      response = this.replaceUsername(response, un);
    else
      response = this.replaceUsername(response, match[index]);
    response = response.replace("%emote_here%", channels[channel]["emoji"]);
    return response;
  }
  return "";
}

client.on("cheer", (channel, userstate, message) => {
  let bits_count = ~~userstate["bits"];
  console.log(`\u001b[33m${getCurrentTimeString()} ${userstate["display-name"]} cheer with ${bits_count} bits. \u001b[0m`); // print bits amount
  let response = `@${userstate["display-name"]} 感謝小奇點 %emote_here% `;
  console.log(channel, channel.substring(1), message)
  if (channel.substring(1) == "hana_yuuka") {
    setTimeout(function () {
      if (message.includes("加班")) {
        client.say(channel, `優花加班 ${int(bits_count) / 20} 分鐘`);
      } else if (message.includes("減班")) {
        client.say(channel, `優花減班 ${int(bits_count) / 20} 分鐘`);
      }
    }, 1 * 1_000);
  }

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

let gift_queue = [];

class GiftTask {
  constructor() {
    this.last_count = 1;
    this.count = 1;
  }

  add() {
    this.count++;
  }

  check() {
    if (this.last_count == this.count) {
      return true;
    }
    this.last_count = this.count;
    return false
  }
}

client.on(
  "subgift",
  (channel, username, streakMonths, recipient, methods, userstate) => {
    if (gift_queue[channel] === undefined) {
      gift_queue[channel] = new GiftTask();
      let timer = setInterval(function () {
        // check if there are more gift
        if (gift_queue[channel].check()) {
          clearInterval(timer);
          let response = `@${username} 感謝贈送訂閱 %emote_here% `;
          // stop counting and send response
          sayFormatResponse(channel, response);
          gift_queue[channel] = undefined;
          console.log(`${channel}, ${username} stop`)
        } else {
          console.log(`${channel}, ${username} continue`)
        }
      }, 3 * 1_000);
    } else {
      gift_queue[channel].add();
    }
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
        console.log(`\u001b[32m${getCurrentTimeString()} ${ch}: ${response}\u001b[0m`);
      } else {
        console.log(`\u001b[31m${getCurrentTimeString()} ${ch}: ${response}\u001b[0m`);
      }
      break;
    }
  }
}

/**
 * Replace username placeholder in response
 * 
 * @param {string} response 
 * @param {string} username 
 * @returns 
 */
module.exports.replaceUsername = function (response, username) {
  return response.replace("%username%", username);
}

/**
 * Get local datetime string
 * 
 * @returns {string} Local time string
 */
function getCurrentTimeString() {
  today = new Date().toLocaleString('zh-TW');
  return `[ ${today} ] `;
}

client.connect().catch(console.error);