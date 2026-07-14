const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const scriptPath = path.resolve(__dirname, '../source/js/stars.js');
const source = fs.readFileSync(scriptPath, 'utf8');
const cssPath = path.resolve(__dirname, '../source/css/hexo-stars.css');
const css = fs.readFileSync(cssPath, 'utf8');
const svgPath = path.resolve(__dirname, '../source/img/bg_flower_star.svg');

assert.match(css, /\.joe-stars/, 'stars css should define layer');
assert.match(css, /joe-star-flash/, 'stars css should define flash animation');
assert.match(css, /joe-star-spin/, 'stars css should define spin animation');
assert.ok(fs.existsSync(svgPath), 'flower star svg asset should exist');

const appended = [];
const layer = {
  id: 'joe-stars',
  children: [],
  appendChild(node) {
    this.children.push(node);
    appended.push(node);
  },
  querySelectorAll(selector) {
    if (selector === '.joe-stars__item') return this.children.slice();
    return [];
  },
  contains() { return true; }
};

const document = {
  documentElement: {
    attributes: { 'data-mode': 'light' },
    getAttribute(name) { return this.attributes[name]; },
    setAttribute(name, value) { this.attributes[name] = value; }
  },
  body: {
    contains(node) { return node === layer; }
  },
  getElementById(id) {
    return id === 'joe-stars' ? layer : null;
  },
  createElement(tag) {
    const node = {
      tagName: tag,
      className: '',
      attrs: {},
      style: {
        props: {},
        setProperty(k, v) { this.props[k] = v; }
      },
      children: [],
      setAttribute(k, v) { this.attrs[k] = v; },
      appendChild(child) { this.children.push(child); }
    };
    return node;
  }
};

vm.runInNewContext(source, {
  window: {
    ThemeConfig: {
      enable_stars: true,
      stars_count: 8,
      stars_min_size: 14,
      stars_max_size: 18,
      stars_image: '',
      BASE_RES_URL: '/'
    },
    __joeStarsReady: false
  },
  document,
  Math,
  Number,
  String
});

assert.strictEqual(layer.children.length, 8, 'should spawn configured star count');
assert.ok(layer.children.every((el) => el.tagName === 'span'), 'stars should be span wrappers');
assert.ok(
  layer.children.every((el) => el.children[0] && el.children[0].tagName === 'img'),
  'each star should contain an img'
);
assert.ok(
  layer.children.every((el) => el.style.props['--x'] && el.style.props['--y']),
  'each star should set viewport position vars'
);
assert.match(
  layer.children[0].children[0].src,
  /bg_flower_star\.svg$/,
  'default image should be theme flower-star svg'
);

console.log('stars.test.js PASS');
