import { test, expect } from '@playwright/test';

test('inspect mini-sudoku board layout', async ({ page }) => {
  // Navigate to mini-sudoku app
  await page.goto('http://localhost:5174');

  // Wait for the board to load
  await page.waitForSelector('.board', { timeout: 10000 });

  // Take a screenshot of the entire page
  await page.screenshot({ path: 'mini-sudoku-full-page.png', fullPage: true });

  // Take a focused screenshot of just the board
  const board = page.locator('.board');
  await board.screenshot({ path: 'mini-sudoku-board-only.png' });

  // Get board dimensions and structure info
  const boardBox = await board.boundingBox();
  console.log('Board dimensions:', boardBox);

  // Count the cells
  const cells = page.locator('.cell');
  const cellCount = await cells.count();
  console.log('Number of cells:', cellCount);

  // Check if cells are arranged in rows
  const rows = page.locator('.board > div');
  const rowCount = await rows.count();
  console.log('Number of direct children (rows?):', rowCount);

  // Get the computed styles of the board
  const boardStyles = await board.evaluate(el => {
    const computed = window.getComputedStyle(el);
    return {
      display: computed.display,
      gridTemplateColumns: computed.gridTemplateColumns,
      gridTemplateRows: computed.gridTemplateRows,
      flexDirection: computed.flexDirection,
      width: computed.width,
      height: computed.height
    };
  });
  console.log('Board CSS styles:', boardStyles);

  // Check first few cells' positions
  for (let i = 0; i < Math.min(9, cellCount); i++) {
    const cell = cells.nth(i);
    const cellBox = await cell.boundingBox();
    const cellText = await cell.textContent();
    console.log(`Cell ${i}: position (${cellBox?.x}, ${cellBox?.y}), text: "${cellText}"`);
  }

  // Check if there are any layout issues visible
  const pageTitle = await page.title();
  console.log('Page title:', pageTitle);

  // Look for any error messages or broken layout indicators
  const hasErrors = await page.locator('.error, [class*="error"]').count() > 0;
  console.log('Visible errors found:', hasErrors);
});