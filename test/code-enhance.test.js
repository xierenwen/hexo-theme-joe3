const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const scriptPath = path.resolve(__dirname, '../source/js/hexo-joe.js');
const source = fs.readFileSync(scriptPath, 'utf8');

const createFigure = (lang, lines) => {
  const lineNodes = lines.map((text) => ({
    textContent: text
  }));

  return {
    className: `highlight ${lang}`,
    attributes: {},
    children: [],
    classList: {
      values: ['highlight', lang],
      add(name) {
        if (this.values.indexOf(name) === -1) this.values.push(name);
      }
    },
    getAttribute(name) {
      return this.attributes[name];
    },
    setAttribute(name, value) {
      this.attributes[name] = value;
    },
    querySelector(selector) {
      if (selector === 'td.code' || selector === '.code') {
        return {
          querySelectorAll(inner) {
            if (inner === '.line') return lineNodes;
            return [];
          },
          textContent: lines.join('\n')
        };
      }
      return null;
    },
    appendChild(node) {
      this.children.push(node);
    }
  };
};

const runEnhance = (themeConfig, figures) => {
  const created = [];
  const document = {
    documentElement: { setAttribute() {} },
    getElementById() { return null; },
    createElement(tag) {
      const node = {
        tagName: tag,
        type: '',
        className: '',
        title: '',
        innerHTML: '',
        attributes: {},
        setAttribute(name, value) { this.attributes[name] = value; }
      };
      created.push(node);
      return node;
    },
    querySelector() { return null; },
    querySelectorAll(selector) {
      if (selector === '.joe_detail__article figure.highlight') return figures;
      if (selector === '.joe_search__open') return [];
      return [];
    },
    getElementsByTagName() { return []; },
    addEventListener() {}
  };

  const clipboardInstances = [];
  const window = {
    document,
    ThemeConfig: themeConfig,
    JoeHexo: {},
    ClipboardJS: function (button, options) {
      clipboardInstances.push({ button, options });
      this.on = function () { return this; };
    },
    Qmsg: { success() {} },
    addEventListener() {},
    matchMedia() { return { matches: false }; }
  };

  vm.runInNewContext(source, {
    window,
    document,
    localStorage: { getItem() { return null; }, setItem() {} },
    Date,
    fetch() { return Promise.reject(new Error('offline')); }
  });

  return {
    figures,
    created,
    clipboardInstances,
    JoeHexo: window.JoeHexo
  };
};

const figure = createFigure('java', ['class A {}', '']);
const result = runEnhance({
  enable_darkmode: false,
  enable_code_title: true,
  enable_code_macdot: true,
  enable_code_copy: true,
  enable_hitokoto: false
}, [figure]);

assert.strictEqual(figure.attributes['data-joe-code'], '1');
assert.ok(figure.classList.values.indexOf('joe-code') !== -1);
assert.ok(figure.classList.values.indexOf('joe-code--macdot') !== -1);
assert.strictEqual(result.JoeHexo.getHighlightLang(figure), 'java');
assert.strictEqual(result.JoeHexo.getHighlightText(figure), 'class A {}\n');
assert.ok(figure.children.some((child) => child.className === 'joe-code__title' && child.textContent === 'java'));
assert.ok(figure.children.some((child) => child.className === 'joe-code__copy'));
assert.strictEqual(result.clipboardInstances.length, 1);
assert.strictEqual(result.clipboardInstances[0].options.text(), 'class A {}\n');

const disabled = createFigure('js', ['a']);
runEnhance({
  enable_darkmode: false,
  enable_code_title: false,
  enable_code_macdot: false,
  enable_code_copy: false,
  enable_hitokoto: false
}, [disabled]);
assert.strictEqual(disabled.attributes['data-joe-code'], undefined);
assert.strictEqual(disabled.children.length, 0);

console.log('code-enhance.test.js PASS');
