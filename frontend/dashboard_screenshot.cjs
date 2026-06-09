const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 10000 });
    await page.type('#email', 'kayal@gmail.com');
    await page.type('#password', '12345678');
    await page.click('button[type="submit"]');
    
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: 'dashboard_screenshot.png' });
    console.log("Screenshot of dashboard saved.");
  } catch (err) {
    console.log("Script error:", err.message);
  }
  
  await browser.close();
})();
