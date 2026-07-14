const assert = require('assert');
const { pickRelated } = require('../scripts/lib/related');

const current = { _id: '1', tags: { data: [{ name: 'Java' }] }, categories: { data: [] } };
const pool = [
  { _id: '1', title: 'self', tags: { data: [{ name: 'Java' }] }, categories: { data: [] } },
  { _id: '2', title: 'a', tags: { data: [{ name: 'Java' }] }, categories: { data: [] } },
  { _id: '3', title: 'b', tags: { data: [{ name: 'Go' }] }, categories: { data: [] } },
  { _id: '4', title: 'c', tags: { data: [{ name: 'Java' }, { name: 'JVM' }] }, categories: { data: [] } }
];
const got = pickRelated(current, pool, 2).map((p) => p._id);

assert.deepStrictEqual(got, ['4', '2']);

console.log('related.test.js PASS');
