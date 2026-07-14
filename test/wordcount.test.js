const assert = require('assert');
const { countWords, readingTime } = require('../scripts/lib/wordcount');

const html = '<p>Hello 世界，这是测试。</p><pre>code</pre>';
const n = countWords(html);

assert.ok(n >= 6, 'should count CJK and latin words, got ' + n);
assert.strictEqual(readingTime(600, 300), 2);

console.log('wordcount.test.js PASS');
