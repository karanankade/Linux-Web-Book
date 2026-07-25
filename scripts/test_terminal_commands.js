const fs = require('fs');

const code = fs.readFileSync('js/script.js', 'utf8');

global.document = {
  addEventListener: (evt, cb) => {},
  getElementById: (id) => ({
    textContent: '',
    value: '',
    style: {},
    appendChild: () => {},
    addEventListener: () => {},
    classList: { add: () => {}, remove: () => {} },
    scrollTop: 0,
    scrollHeight: 100
  }),
  createElement: (tag) => ({
    className: '',
    textContent: '',
    style: {},
    appendChild: () => {}
  })
};
global.window = {
  addEventListener: () => {}
};

eval(code);

console.log("Mock environment loaded. Script evaluated cleanly!");
