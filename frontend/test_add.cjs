const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('PAGE ERROR:', msg.text());
    }
  });
  
  await page.goto('http://localhost:5173/login');
  await page.click('button[type="submit"]');
  await page.waitForNavigation();
  
  await page.goto('http://localhost:5173/#/masters', {waitUntil: 'networkidle0'});
  console.log('waiting for page load...');
  await new Promise(r => setTimeout(r, 2000));

  // try to add a department
  console.log('navigating to departments tab...');
  await page.evaluate(() => {
    document.querySelectorAll('button').forEach(b => {
      if(b.innerText.includes('Departments')) b.click();
    });
  });
  await new Promise(r => setTimeout(r, 1000));
  
  console.log('typing new department...');
  await page.type('input[placeholder="Enter Department name"]', 'Test Department');
  await page.click('button[type="submit"]');
  
  console.log('waiting after submit...');
  await new Promise(r => setTimeout(r, 2000));
  
  await browser.close();
})();
