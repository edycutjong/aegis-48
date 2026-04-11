import { chromium, Page } from 'playwright';
import path from 'path';

async function smoothMouseMove(page: Page, x: number, y: number, steps = 30) {
  await page.mouse.move(x, y, { steps });
}

async function smoothScroll(page: Page, yOffset: number) {
  await page.mouse.wheel(0, yOffset);
  await page.waitForTimeout(600);
}

async function typeLikeUser(page: Page, selector: string, text: string) {
  const locator = page.locator(selector);
  await locator.click();
  for (const char of text) {
    await page.keyboard.type(char, { delay: Math.random() * 80 + 30 }); // Random typing delays
  }
}

async function runBRoll() {
  console.log('🎥 Starting B-Roll Casual Usage Recording...');
  
  const browser = await chromium.launch({
    headless: false,
    slowMo: 60,
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: { 
      dir: 'recordings/', 
      size: { width: 1920, height: 1080 } 
    }
  });

  const page = await context.newPage();

  console.log('Loading app at localhost:3000...');
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  
  // Stare at the landing page for a moment
  await page.waitForTimeout(3000);
  
  // Wiggle mouse organically
  await smoothMouseMove(page, 500, 300);
  await page.waitForTimeout(500);
  await smoothMouseMove(page, 960, 400);

  // Type an address into the search bar naturally
  console.log('Typing address...');
  await typeLikeUser(page, 'input[placeholder*="contract address"]', '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD1e');
  await page.waitForTimeout(800);
  
  // Press enter
  await page.keyboard.press('Enter');
  
  console.log('Waiting for EVM analysis to finish...');
  await page.waitForTimeout(7000); // Wait for the whole animation + network

  // Look around the vulnerable report
  await smoothScroll(page, 200);
  await page.waitForTimeout(2000);
  
  console.log('Clicking vulnerability card...');
  await page.locator('text=Reentrancy Attack').first().click();
  await smoothScroll(page, 250);
  await page.waitForTimeout(4000);

  // Return to home
  console.log('Going back...');
  await page.locator('text=Back').first().click();
  await page.waitForTimeout(2500);

  // Click Solana chip
  console.log('Clicking Solana Safe chip...');
  await page.locator('button:has-text("Safe Solana")').click();

  console.log('Waiting for Solana analysis to finish...');
  await page.waitForTimeout(7000); // 7s for full animation

  // Scroll safely
  await smoothScroll(page, 300);
  await page.waitForTimeout(2000);

  // Mint credential 
  console.log('Minting...');
  await page.locator('button', { hasText: 'Mint Aegis Verified Credential' }).click();
  await page.waitForTimeout(4500); // Wait for confirmation

  // Check history
  console.log('Checking history...');
  await page.locator('text=History').click();
  await page.waitForTimeout(2000);
  await smoothScroll(page, 400);
  await page.waitForTimeout(2000);

  console.log('🎥 B-Roll sequence complete. Closing browser...');
  await page.close();
  await context.close();
  
  const videoPath = await page.video()?.path();
  if (videoPath) {
    const finalPath = path.join('/Users/edycu/Projects/DemoStudio/public/projects/Aegis48', 'Aegis48_BRoll.webm');
    require('fs').renameSync(videoPath, finalPath);
    console.log(`🎬 B-Roll recorded at: ${finalPath}`);
  }

  await browser.close();
  process.exit(0);
}

runBRoll().catch((err) => {
  console.error('Failed to run b-roll:', err);
  process.exit(1);
});
