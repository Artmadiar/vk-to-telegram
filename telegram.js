const request = require('request-promise');
const botApiKey = process.env.TELEGRAM_BOT_TOKEN;
const channel = process.env.TELEGRAM_CHANNEL;

module.exports.sendToChannel = (text) => {
  const url = `https://api.telegram.org/bot${botApiKey}/sendMessage?chat_id=${channel}&text=${text}`;

  return new Promise((resolve) => {
    setTimeout(() => resolve(), 1000);
  })
  .then(() => request(url));
}