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
    await page.type('#email', 'kayal@gmail.com');
    await page.type('#password', '12345678');
    await page.click('button[type="submit"]');
    
    await new Promise(r => setTimeout(r, 2000));
    console.log("Checking /#/reports...");
    await page.goto('http://localhost:5173/#/reports', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1000));

    console.log("Checking /#/masters...");
    await page.goto('http://localhost:5173/#/masters', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1000));

    console.log("Done checking.");
  } catch (err) {
    console.log("Script error:", err.message);
  }
  
  await browser.close();
})();
