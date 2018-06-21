require('dotenv').config();

const Telegraf = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

const vkPosts = require('./vk-posts');
const postUrl = require('./vk-post-builder');
const store = require('./store');
const clients = store.getClients();

// init events
bot.start((ctx) => {
  // ctx.from
  clients.push(ctx.chat.id);
  store.addClient(ctx.chat.id);

  return ctx.reply('Welcome!');
});
bot.help((ctx) => ctx.reply(`I'm a personal property of artmadiar`));

// bot.on('sticker', (ctx) => ctx.reply('👍'))
// bot.hears('hi', (ctx) => ctx.reply('Hey there'))
// bot.hears(/buy/i, (ctx) => ctx.reply('Buy-buy'))

const CronJob = require('cron').CronJob;
new CronJob('* * * * * *',
  // function for job
  async () => {
    if (!clients.length) {
      return;
    }

    const posts = await vkPosts();
    let lastPostId = store.getLastPostId();
    const lastPostDetected = false;

    // get new posts
    const toSend = posts.reduce((ar, post) => {
      if (post.id === lastPostId) {
        lastPostDetected = true;
      }

      if (lastPostDetected) {
        return ar;
      }

      return [...ar, post];
    }, []);

    // update mark (last postId)
    lastPostId = posts[0].id;
    store.setLlastPostId(lastPostId);


    // sending
    toSend.forEach((post) => {
      clients.forEach((client) => {
        bot.sendMessage(client, postUrl(post))
        .catch((err) => {
          console.log(err);
        });
      });
    });
  },
  // when it ends
  () => {
    console.log('Telegram bot was stopped: ', new Date());
  },
  // run immediately
  true);

bot.startPolling();
console.log('Telegram bot is working: ', new Date());
