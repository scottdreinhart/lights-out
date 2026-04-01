const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5175');
  await page.waitForSelector('.board', { timeout: 10000 });

  // Take screenshot
  await page.screenshot({ path: 'mini-sudoku-board.png' });

  // Get board info
  const board = await page.$('.board');
  const cells = await page.$$('.cell');
  console.log('Found', cells.length, 'cells');

  const boardBox = await board.boundingBox();
  console.log('Board dimensions:', boardBox);

  // Check CSS
  const display = await page.evaluate(() => {
    const board = document.querySelector('.board');
    const computed = window.getComputedStyle(board);
    return {
      display: computed.display,
      gridTemplateColumns: computed.gridTemplateColumns,
      gridTemplateRows: computed.gridTemplateRows,
      width: computed.width,
      height: computed.height
    };
  });
  console.log('Board CSS:', display);

  // Check cell arrangement
  const rowElements = await page.$$('.board > div');
  console.log('Number of direct children (potential rows):', rowElements.length);

  // Check first few cells
  for (let i = 0; i < Math.min(9, cells.length); i++) {
    const cell = cells[i];
    const text = await cell.evaluate(el => el.textContent);
    const box = await cell.boundingBox();
    console.log(`Cell ${i}: "${text}", position: (${box.x}, ${box.y})`);
  }

  await browser.close();
})();