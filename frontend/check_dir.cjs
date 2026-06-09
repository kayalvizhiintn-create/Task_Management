const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('PAGE ERROR:', msg.text());
    }
  });
  page.on('pageerror', err => {
    console.log('UNCAUGHT EXCEPTION:', err.toString());
  });
  
  await page.goto('http://localhost:5173/login');
  await page.click('button[type=\"submit\"]');
  await page.waitForNavigation();
  
  await page.goto('http://localhost:5173/#/directory', {waitUntil: 'networkidle0', timeout: 5000}).catch(e=>{});
  
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
})();
