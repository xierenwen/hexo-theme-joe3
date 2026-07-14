const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const scriptPath = path.resolve(__dirname, '../source/js/hexo-joe.js');
const source = fs.readFileSync(scriptPath, 'utf8');

const createScriptParent = () => {
  const children = [];

  return {
    children,
    insertBefore(node) {
      children.push(node);
    }
  };
};

const runJoeScript = (weatherContainer) => {
  const scriptParent = createScriptParent();
  const appendedScripts = scriptParent.children;

  const document = {
    documentElement: {
      setAttribute() {}
    },
    createElement(tagName) {
      return {
        tagName,
        attributes: {},
        set src(value) {
          this.attributes.src = value;
        },
        get src() {
          return this.attributes.src;
        }
      };
    },
    getElementById() {
      return null;
    },
    getElementsByTagName(tagName) {
      if (tagName === 'script') return [{ parentNode: scriptParent }];
      return [];
    },
    querySelector(selector) {
      if (selector === '#joe-weather[data-token]') return weatherContainer;
      if (selector === '.joe_search') return null;
      return null;
    },
    querySelectorAll() {
      return [];
    },
    addEventListener() {}
  };

  const window = {
    document,
    ThemeConfig: {},
    JoeHexo: {},
    addEventListener(eventName, callback) {
      if (eventName === 'load') callback();
    }
  };

  vm.runInNewContext(source, {
    window,
    document,
    localStorage: {
      getItem() { return null; },
      setItem() {}
    },
    Date
  });

  return {
    appendedScripts,
    widgetCalls: window.SeniverseWeatherWidget ? window.SeniverseWeatherWidget.q || [] : []
  };
};

const weatherContainer = {
  id: 'joe-weather',
  attributes: {
    'data-token': 'weather-token'
  },
  getAttribute(name) {
    return this.attributes[name] || '';
  }
};

const result = runJoeScript(weatherContainer);
const widgetCall = JSON.parse(JSON.stringify(Array.prototype.slice.call(result.widgetCalls[0])));

assert.strictEqual(result.appendedScripts.length, 1, 'weather token should inject Seniverse script');
assert.match(result.appendedScripts[0].src, /cdn\.sencdn\.com\/widget2\/static\/js\/bundle\.js/, 'weather should use Seniverse widget v3 bundle');
assert.deepStrictEqual(widgetCall, [
  'show',
  {
    flavor: 'slim',
    location: 'WX4FBXXFKE4F',
    geolocation: true,
    language: 'zh-Hans',
    unit: 'c',
    theme: 'auto',
    token: 'weather-token',
    hover: 'enabled',
    container: 'joe-weather'
  }
]);

const noTokenContainer = {
  id: 'joe-weather',
  attributes: {},
  getAttribute(name) {
    return this.attributes[name] || '';
  }
};

assert.strictEqual(runJoeScript(noTokenContainer).appendedScripts.length, 0, 'weather without token should not load external scripts');
assert.strictEqual(runJoeScript(null).appendedScripts.length, 0, 'missing weather container should not load external scripts');

console.log('weather-widget.test.js PASS');
