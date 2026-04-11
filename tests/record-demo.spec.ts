import { test, expect } from '@playwright/test';

// Run against your local dev server running on port 3000
// Use `npx playwright test tests/record-demo.spec.ts --headed` to watch it
test.use({ 
  video: 'on',         // This automatically records a video of the full run
  viewport: { width: 1280, height: 720 }, // Standard 720p HD resolution for video upload
  actionTimeout: 10000 
});

test('Aegis-48 Demo Flow', async ({ page }) => {
  // --- SCENE 1 & 2: Landing Page ---
  await page.goto('http://localhost:3000/');
  // Wait to show the cool landing page UI to the audience
  await page.waitForTimeout(3000);

  // --- SCENE 3: Testing a Vulnerable Contract ---
  // Click the vulnerable example chip
  await page.click('text="🔴 Vulnerable EVM"');
  
  // App automatically scans when chip is clicked.
  // The scanning animation is playing... wait until it completes.
  await page.waitForSelector('text="AI Analysis Summary"', { timeout: 15000 });
  
  // The reporting page loaded. Give audience time to see the RED verdict.
  await page.waitForTimeout(3000);

  // Scroll down slightly to show vulnerability cards
  await page.mouse.wheel(0, 300);
  await page.waitForTimeout(2000);

  // Click on a vulnerability card to expand details
  const vulnCard = page.locator('button:has-text("Reentrancy")').first();
  if (await vulnCard.isVisible()) {
    await vulnCard.click();
    await page.waitForTimeout(3000);
  }

  // Go back to Home using the Logo
  await page.click('text="AEGIS-48"');
  await page.waitForTimeout(2000);

  // --- SCENE 4: Testing a Safe Contract ---
  // Click the safe Solana chip
  await page.click('text="🟢 Safe Solana"');
  
  // Wait for the scan animation to finish
  await page.waitForSelector('text="No Vulnerabilities Detected"', { timeout: 15000 });
  
  // Let the audience read the SAFE verdict
  await page.waitForTimeout(3000);

  // Scroll down to the mint button and click it to mint safety credential
  await page.mouse.wheel(0, 300);
  await page.click('button:has-text("Mint Aegis Verified Credential")');
  
  // Wait for the transaction status to turn to success
  await page.waitForSelector('text="Credential Successfully Minted"', { timeout: 10000 });
  await page.waitForTimeout(3000); // Admire the success state

  // --- SCENE 5: Show History Dashboard ---
  // Navigate back to home or directly to history
  await page.click('text="AEGIS-48"');
  await page.waitForTimeout(2000);

  // Go to /history
  await page.goto('http://localhost:3000/history');
  await page.waitForSelector('text="Global Audit Network"');
  
  // Scroll down the history table
  await page.mouse.wheel(0, 400);
  await page.waitForTimeout(3000);

  // Done! The recorded video will automatically be saved in test-results/ 
});
