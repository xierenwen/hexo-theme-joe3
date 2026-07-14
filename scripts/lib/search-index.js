const { stripHtml } = require('./wordcount');

const normalizeText = (content) => stripHtml(content).replace(/\s+/g, ' ').trim();

const getPostUrl = (post) => post.permalink || post.path || post.url || '';

const buildSearchIndex = (posts) => {
  const list = posts && posts.data ? posts.data : posts || [];

  return list.map((post) => ({
    title: normalizeText(post.title),
    url: getPostUrl(post),
    content: normalizeText(post.content || post.excerpt).slice(0, 5000)
  }));
};

module.exports = {
  buildSearchIndex
};
