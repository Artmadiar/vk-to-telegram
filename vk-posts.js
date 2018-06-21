const request = require('request-promise');

const withoutReposts = process.env.VK_WITHOUT_REPOSTS;
const v = process.env.VK_VERSION;
const accessToken = process.env.VK_SERVICE_KEY;
const domain = process.env.VK_GROUP_DOMAIN;
const count = 20;

var url = `https://api.vk.com/method/wall.get?v=${v}&access_token=${accessToken}&domain=${domain}&count=${count}&filter=owner&extended=1`;

module.exports = () => {
  return request({
    url: url,
    json: true
  })
  .then((body) => {
    // error
    if (body.error) {
      throw new Error(body.error.error_msg);
    }

    // body
    if (withoutReposts !== 'true') {
      return body.response.items;
    }

    const posts = body.response.items.filter((post) => {
      return post.copy_history === undefined;
    });

    return posts;
  })
  .catch((err) => {
    console.error(err);
  })
};
