const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const htmlContent = fs.readFileSync('index.html', 'utf-8');
const jsContent = fs.readFileSync('js/script.js', 'utf-8');

const dom = new JSDOM(htmlContent, {
  runScripts: 'dangerously',
  resources: 'usable',
  url: 'file:///C:/Users/Karan/OneDrive/Desktop/Linux%20Web%20Book/index.html#firewall-management'
});

const window = dom.window;
const document = window.document;

// Execute script.js
const scriptEl = document.createElement('script');
scriptEl.textContent = jsContent;
document.body.appendChild(scriptEl);

console.log('--- TESTING FIREWALL & ZONE MANAGER BUTTONS ---');

const getZoneBtn = document.getElementById('fwm-get-zone-btn');
const listAllBtn = document.getElementById('fwm-list-all-btn');
const addSvcBtn = document.getElementById('fwm-add-svc-btn');
const rmSvcBtn = document.getElementById('fwm-rm-svc-btn');
const addPortBtn = document.getElementById('fwm-add-port-btn');
const reloadBtn = document.getElementById('fwm-reload-btn');
const logDisplay = document.getElementById('fwm-log-display');

console.log('Get Default Zone Button exists:', !!getZoneBtn);
console.log('List Active Rules Button exists:', !!listAllBtn);
console.log('Add Service Button exists:', !!addSvcBtn);
console.log('Log Display exists:', !!logDisplay);

if (getZoneBtn && logDisplay) {
  getZoneBtn.click();
  console.log('\n[AFTER GET DEFAULT ZONE CLICK]:');
  console.log(logDisplay.textContent);

  addSvcBtn.click();
  console.log('\n[AFTER ADD SERVICE CLICK]:');
  console.log(logDisplay.textContent);

  listAllBtn.click();
  console.log('\n[AFTER LIST ALL CLICK]:');
  console.log(logDisplay.textContent);

  addPortBtn.click();
  console.log('\n[AFTER ADD PORT CLICK]:');
  console.log(logDisplay.textContent);

  reloadBtn.click();
  console.log('\n[AFTER RELOAD CLICK]:');
  console.log(logDisplay.textContent);
} else {
  console.error('ERROR: Could not find firewall widget elements!');
}
