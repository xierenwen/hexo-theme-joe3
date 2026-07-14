const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const scriptPath = path.resolve(__dirname, '../source/js/hexo-joe.js');
const source = fs.readFileSync(scriptPath, 'utf8');

const runHitokoto = (payload, rejectFetch) => {
  const textEl = { textContent: '加载中…' };
  const fromEl = { textContent: '', hidden: true };
  const card = { id: 'joe-hitokoto' };

  const document = {
    documentElement: { setAttribute() {} },
    getElementById(id) {
      if (id === 'joe-hitokoto-text') return textEl;
      if (id === 'joe-hitokoto-from') return fromEl;
      if (id === 'joe-hitokoto') return card;
      return null;
    },
    createElement() { return {}; },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    getElementsByTagName() { return []; },
    addEventListener() {}
  };

  const fetchCalls = [];
  const fetchImpl = function (url) {
    fetchCalls.push(url);
    if (rejectFetch) return Promise.reject(new Error('network'));
    return Promise.resolve({
      ok: true,
      json() { return Promise.resolve(payload); }
    });
  };

  const window = {
    document,
    ThemeConfig: {
      enable_darkmode: false,
      enable_hitokoto: true,
      hitokoto_api: 'https://v1.hitokoto.cn',
      hitokoto_type: 'i',
      enable_code_title: false,
      enable_code_macdot: false,
      enable_code_copy: false
    },
    JoeHexo: {},
    addEventListener() {},
    matchMedia() { return { matches: false }; }
  };

  vm.runInNewContext(source, {
    window,
    document,
    localStorage: { getItem() { return null; }, setItem() {} },
    Date,
    fetch: fetchImpl
  });

  return new Promise(function (resolve) {
    setImmediate(function () {
      resolve({ textEl, fromEl, fetchCalls });
    });
  });
};

runHitokoto({ hitokoto: '山河远阔', from: '诗词' }).then((ok) => {
  assert.ok(ok.fetchCalls[0].indexOf('https://v1.hitokoto.cn') === 0);
  assert.ok(ok.fetchCalls[0].indexOf('c=i') !== -1);
  assert.strictEqual(ok.textEl.textContent, '山河远阔');
  assert.strictEqual(ok.fromEl.textContent, '— 诗词');
  assert.strictEqual(ok.fromEl.hidden, false);

  return runHitokoto(null, true);
}).then((fail) => {
  assert.strictEqual(fail.textEl.textContent, '获取一言失败');
  assert.strictEqual(fail.fromEl.hidden, true);
  console.log('hitokoto-aside.test.js PASS');
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
