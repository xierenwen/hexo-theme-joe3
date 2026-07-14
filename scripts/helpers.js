const { countWords, readingTime } = require('./lib/wordcount');
const { pickRelated } = require('./lib/related');

hexo.extend.helper.register('joe_wordcount', function (content) {
  return countWords(content);
});

hexo.extend.helper.register('joe_reading_time', function (content) {
  return readingTime(countWords(content));
});

hexo.extend.helper.register('joe_related', function (post, count) {
  const theme = hexo.theme.config;
  if (!theme.related_posts || theme.related_posts.enable === false) return [];
  const n = count || theme.related_posts.count || 3;
  return pickRelated(post, hexo.locals.get('posts').data || hexo.locals.get('posts'), n);
});
