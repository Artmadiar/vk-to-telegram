require('dotenv').config();

const vkPosts = require('./vk-posts');
const postUrl = require('./vk-post-builder');
const telegram = require('./telegram');
const store = require('./store');

const CronJob = require('cron').CronJob;
new CronJob('10 * * * * *',
  // function for job
  async () => {
    console.log('Cron job is jobbing :)' , new Date());

    const posts = await vkPosts();
    let lastPostId = store.getLastPostId();
    let lastSpluId = store.getLastSpoluId();
    let lastPostDetected = false;

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

    // sending
    toSend.forEach((post) => {
      telegram.sendToChannel(postUrl(post))
        .then((res) => {
          const result = JSON.parse(res);
          if (result.ok) {
            // update mark (last postId)
            lastPostId = post.id;
            store.setLastPostId(lastPostId);
            console.log('Message to telegram channel was successfully sent. ', new Date());
          } else {
            console.error('Error sending message to telegram channel');
            process.exit(1);
          }
        })
        .catch((err) => {
          console.error(err.message);
          process.exit(1);
        });
    });
  },
  // when it ends
  () => {
    console.log('Telegram bot was stopped: ', new Date());
  },
  // run immediately
  true);
