const toArray = (collection) => {
  if (!collection) return [];
  if (Array.isArray(collection)) return collection;
  if (Array.isArray(collection.data)) return collection.data;
  if (typeof collection.toArray === 'function') return collection.toArray();
  return [];
};

const getNames = (taxonomy) => toArray(taxonomy)
  .map((item) => typeof item === 'string' ? item : item && item.name)
  .filter(Boolean);

const countOverlap = (left, right) => {
  const rightSet = new Set(right);
  return left.filter((name) => rightSet.has(name)).length;
};

const scorePost = (current, post) => {
  const tagScore = countOverlap(getNames(current.tags), getNames(post.tags)) * 2;
  const categoryScore = countOverlap(getNames(current.categories), getNames(post.categories));

  return tagScore + categoryScore;
};

const pickRelated = (current, posts, count) => {
  count = count || 3;

  return toArray(posts)
    .map((post, index) => ({
      post,
      index,
      score: post && post._id === current._id ? 0 : scorePost(current, post || {}),
      taxonomyCount: getNames((post || {}).tags).length + getNames((post || {}).categories).length
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || b.taxonomyCount - a.taxonomyCount || a.index - b.index)
    .slice(0, count)
    .map((item) => item.post);
};

module.exports = {
  pickRelated
};
