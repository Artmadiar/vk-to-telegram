module.exports = (post) => {
  const domain = process.env.VK_GROUP_DOMAIN;

  return `https://vk.com/${domain}?w=wall${post.from_id}_${post.id}`;
};
