import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const OUT_DIR = 'screenshots';

// Sample demo contracts that will force specific results
const EVM_VULNERABLE = '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD1e';
const SVM_SAFE = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';

async function runScreenshots() {
  console.log('📸 Starting Screenshot script...');
  
  // Ensure output directory exists
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR);
  }

  // Launch browser (headless is fine for screenshots, it's actually faster)
  const browser = await chromium.launch({ headless: true });
  
  // Create context with 1920x1080 viewport for high quality full HD screenshots
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  console.log('Taking screenshot of Landing Page...');
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  // Wait a moment for any initial entrance animations
  await page.waitForTimeout(1500); 
  await page.screenshot({ path: path.join(OUT_DIR, '01-Landing-Page.png'), fullPage: true });

  console.log('Taking screenshot of Vulnerability Report (RED)...');
  await page.goto(`http://localhost:3000/audit/ethereum/${EVM_VULNERABLE}`);
  await page.waitForLoadState('networkidle');
  // Wait for scanning animation to conclude
  await page.waitForTimeout(4000); 
  await page.screenshot({ path: path.join(OUT_DIR, '02-Vulnerable-Report-EVM.png'), fullPage: true });

  console.log('Taking screenshot of Safe Report (GREEN)...');
  await page.goto(`http://localhost:3000/audit/solana/${SVM_SAFE}`);
  await page.waitForLoadState('networkidle');
  // Wait for scanning animation to conclude 
  await page.waitForTimeout(4000);
  await page.screenshot({ path: path.join(OUT_DIR, '03-Safe-Report-Solana.png'), fullPage: true });

  console.log('Taking screenshot of History Page...');
  await page.goto('http://localhost:3000/history');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT_DIR, '04-Audit-History.png'), fullPage: true });

  console.log(`✅ All screenshots saved successfully to the "${OUT_DIR}" directory!`);

  await page.close();
  await context.close();
  await browser.close();
}

runScreenshots().catch((err) => {
  console.error('Failed to capture screenshots:', err);
  process.exit(1);
});
