const { buildSearchIndex } = require('./lib/search-index');

hexo.extend.generator.register('joe_search', function (locals) {
  const theme = hexo.theme.config;

  if (!theme.search || !theme.search.enable) return [];

  return {
    path: theme.search.path || 'search.json',
    data: JSON.stringify(buildSearchIndex(locals.posts), null, 2)
  };
});
