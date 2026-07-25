const fs = require('fs');

// Mock DOM
const mockElements = {};
function createMockElement(id, value = 'public') {
  const el = {
    id: id,
    value: value,
    listeners: {},
    textContent: '',
    style: {},
    classList: { add: () => {}, remove: () => {} },
    getAttribute: () => 'firewall-management',
    querySelector: () => createMockElement('dummy'),
    appendChild: () => {},
    addEventListener: function(evt, fn) {
      this.listeners[evt] = fn;
    },
    click: function() {
      if (this.listeners['click']) this.listeners['click']();
    }
  };
  mockElements[id] = el;
  return el;
}

const elementIds = [
  'fwm-zone-val', 'fwm-item-val', 'fwm-get-zone-btn', 'fwm-list-all-btn',
  'fwm-add-svc-btn', 'fwm-rm-svc-btn', 'fwm-add-port-btn', 'fwm-reload-btn', 'fwm-log-display',
  'net-cmd-display', 'net-log-display', 'pkg-cmd-display', 'pkg-log-display', 'transfer-log-display', 'transfer-run-btn'
];

elementIds.forEach(id => createMockElement(id));

let domLoadedCb = null;
global.document = {
  getElementById: (id) => mockElements[id] || createMockElement(id),
  querySelector: () => createMockElement('dummy'),
  querySelectorAll: () => [createMockElement('dummy')],
  createElement: (tag) => createMockElement(tag),
  addEventListener: (evt, fn) => { if (evt === 'DOMContentLoaded') domLoadedCb = fn; },
  documentElement: { setAttribute: () => {} }
};

global.window = {
  addEventListener: () => {},
  location: { hash: '#firewall-management' }
};

global.localStorage = {
  getItem: () => null,
  setItem: () => {}
};

const jsContent = fs.readFileSync('js/script.js', 'utf-8');

try {
  eval(jsContent);
  console.log('Script loaded and evaluated successfully!');

  // Trigger DOMContentLoaded
  if (domLoadedCb) domLoadedCb();

  const getZoneBtn = mockElements['fwm-get-zone-btn'];
  const listAllBtn = mockElements['fwm-list-all-btn'];
  const addSvcBtn = mockElements['fwm-add-svc-btn'];
  const rmSvcBtn = mockElements['fwm-rm-svc-btn'];
  const addPortBtn = mockElements['fwm-add-port-btn'];
  const reloadBtn = mockElements['fwm-reload-btn'];
  const logDisplay = mockElements['fwm-log-display'];

  console.log('\n--- TESTING FIREWALL & ZONE MANAGER BUTTON CLICKS ---');

  getZoneBtn.click();
  console.log('[GET DEFAULT ZONE]:\n' + logDisplay.textContent);

  addSvcBtn.click();
  console.log('[ADD SERVICE]:\n' + logDisplay.textContent);

  listAllBtn.click();
  console.log('[LIST ACTIVE RULES]:\n' + logDisplay.textContent);

  addPortBtn.click();
  console.log('[ADD PORT]:\n' + logDisplay.textContent);

  rmSvcBtn.click();
  console.log('[REMOVE SERVICE]:\n' + logDisplay.textContent);

  reloadBtn.click();
  console.log('[RELOAD FIREWALL]:\n' + logDisplay.textContent);

  console.log('\nSUCCESS! All buttons executed clean output without errors.');

} catch (err) {
  console.error('Execution Error:', err);
  process.exit(1);
}
