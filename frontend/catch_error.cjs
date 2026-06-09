const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('PAGE ERROR LOG:', msg.text());
    }
  });
  page.on('pageerror', error => console.log('UNCAUGHT PAGE ERROR:', error.message));

  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 10000 });
    await page.click('button[type="submit"]');
    
    console.log("Clicked login, waiting for crash...");
    await new Promise(r => setTimeout(r, 3000));
    console.log("Done waiting.");
  } catch (err) {
    console.log("Script error:", err.message);
  }
  
  await browser.close();
})();
