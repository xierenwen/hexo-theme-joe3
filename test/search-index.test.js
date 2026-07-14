const assert = require('assert');
const { buildSearchIndex } = require('../scripts/lib/search-index');

const longContent = '<p>' + 'A'.repeat(6000) + '</p>';
const posts = [
  {
    title: 'Hello <em>Search</em>',
    path: 'hello-search/',
    content: '<p>Hello <strong>世界</strong></p><pre>ignore me</pre>'
  },
  {
    title: 'Long Post',
    permalink: 'https://example.com/long-post/',
    content: longContent
  }
];

const index = buildSearchIndex(posts);

assert.deepStrictEqual(index[0], {
  title: 'Hello Search',
  url: 'hello-search/',
  content: 'Hello 世界'
});
assert.strictEqual(index[1].url, 'https://example.com/long-post/');
assert.strictEqual(index[1].content.length, 5000);

console.log('search-index.test.js PASS');
