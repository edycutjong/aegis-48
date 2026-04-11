import { chromium, Page } from 'playwright';
import { spawn } from 'child_process';
import path from 'path';

// Define the exact audio path
const AUDIO_PATH = '/Users/edycu/Projects/DemoStudio/public/projects/Aegis48/ElevenLabs_2026-04-11T07_33_40_Roger - Laid-Back, Casual, Resonant_pre_sp100_s50_sb75_se0_b_m2.mp3';

async function smoothMouseMove(page: Page, x: number, y: number, steps = 25) {
  await page.mouse.move(x, y, { steps });
}

async function smoothScroll(page: Page, yOffset: number) {
  await page.mouse.wheel(0, yOffset);
  await page.waitForTimeout(500);
}

async function runDemo() {
  console.log('🚀 Starting Demo Recording Script...');
  
  // Launch playwright browser (visible to user, but headless can be used too)
  const browser = await chromium.launch({
    headless: false,
    slowMo: 50, // Slight general slowdown for natural feel
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }, // YouTube 1080p Resolution
    recordVideo: { 
      dir: 'recordings/', 
      size: { width: 1920, height: 1080 } 
    }
  });

  const page = await context.newPage();

  // 1. Prepare: Load the page before starting audio so we don't desync on network latency
  console.log('Loading app at localhost:3000...');
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  
  // Hide the cursor by injecting CSS (optional, but demo studio might prefer no ugly OS cursor)
  // Actually we might want a fake cursor if you want to show where it's clicking, 
  // but Playwright doesn't draw the cursor natively. We'll rely on hover states.

  console.log('🔊 Starting audio and beginning synchronized sequence...');
  
  // Spawn audio asynchronously 
  const audioProcess = spawn('afplay', [AUDIO_PATH]);
  const startTime = Date.now();

  const getT = () => Math.floor((Date.now() - startTime) / 1000);
  const waitTo = async (targetSecond: number) => {
    const targetMs = targetSecond * 1000;
    const elapsed = Date.now() - startTime;
    if (targetMs > elapsed) {
      await page.waitForTimeout(targetMs - elapsed);
    }
  };

  // ----- TIMELINE -----
  
  // [0:00 - 0:13] Introduction / Read Hero
  // "When learning 48 blockchains in 48 weeks, making security mistakes is inevitable because every chain has vastly different patterns. What's a vulnerability on Ethereum looks entirely different on Solana or Aptos."
  await waitTo(5);
  // Simulate natural reading by moving mouse slowly across the header
  await smoothMouseMove(page, 400, 200, 100);
  await waitTo(8);
  await smoothMouseMove(page, 1000, 250, 100);
  
  // [0:14 - 0:22]
  // "That's why we built Aegis-48. A single, cross-chain AI Security Oracle that handles the differing complexities of 48 ecosystems for you so you can focus on building."
  await waitTo(14);
  console.log(`[${getT()}s] Navigated to search bar`);
  await page.locator('input[placeholder*="contract address"]').click();
  await page.waitForTimeout(3000);
  // User changes their mind, decides to click an example instead
  await page.locator('body').click(); // defocus
  
  // [0:23 - 0:35]
  // "Want to review a contract? Just paste the address. Aegis fetches the bytecode instantly via viem or Solana web3, skipping any need for source code."
  await waitTo(24);
  console.log(`[${getT()}s] Clicking Vulnerable EVM chip...`);
  // Click the specific chip "🔴 Vulnerable EVM"
  await page.locator('button:has-text("Vulnerable EVM")').click();

  // Animation plays automatically when routing (takes a few seconds)
  
  // [0:36 - 0:47] 
  // "Our engine feeds the raw bytecode to GPT-4o using strict Structured Outputs mapped specifically to that chain's vulnerabilities, absolutely eliminating AI hallucination."
  await waitTo(36);
  // At this point RED verdict should be visible, scroll down slightly
  await smoothScroll(page, 300);

  // [0:48 - 0:55]
  // "Here, it instantly catches a Reentrancy vector, giving you exact line remediation without scanning unverified code."
  await waitTo(48);
  console.log(`[${getT()}s] Clicking Reentrancy card...`);
  // Click the Vulnerability card to show the code mapping
  await page.locator('text=Reentrancy Attack').first().click();
  await smoothScroll(page, 150);

  // [0:56 - 1:05]
  // "But what if your code is secure? Let's check a safe Solana contract."
  await waitTo(56);
  console.log(`[${getT()}s] Going back...`);
  await page.locator('text=Back').first().click();
  
  await waitTo(60);
  console.log(`[${getT()}s] Clicking Safe Solana chip...`);
  await page.locator('button:has-text("Safe Solana")').click();

  // [1:06 - 1:16]
  // "Aegis runs its deterministic checklist against Solana's specific vectors like missing signers and account injection. Because it strictly follows the schema, it returns a Safe verdict."
  await waitTo(68);
  // Screen should be Green Verdict now
  await smoothScroll(page, 400);

  // [1:17 - 1:30]
  // "For safe contracts, Aegis-48 allows you to mint a Verified Credential NFT, giving your users verifiable proof that your smart contract is battle-hardened regardless of which chain it lives on."
  await waitTo(77);
  console.log(`[${getT()}s] Minting Credential...`);
  // Click Mint Button
  await page.locator('button', { hasText: 'Mint Aegis Verified Credential' }).click();

  // Takes ~2.5s for Mint to turn green

  // [1:31 - 1:37]
  // "All audits are cached in Supabase, contributing to a global history ledger of cross-chain security."
  await waitTo(91);
  console.log(`[${getT()}s] Navigating to History...`);
  await page.locator('text=History').click();

  await waitTo(94);
  await smoothScroll(page, 500);

  // [1:38 - 1:40]
  // "Aegis-48 isn't just another dapp. It's the ultimate cross-chain meta-tool and security safety net. Thank you for watching."
  await waitTo(100);
  
  console.log('✅ Demo sequence complete. Closing browser...');
  await page.close(); // Need to close page first to make sure video is fully written
  await context.close();
  
  // Rename the output video file
  const videoPath = await page.video()?.path();
  if (videoPath) {
    const finalPath = path.join(path.dirname(videoPath), 'Aegis48-YouTube-Demo.webm');
    require('fs').renameSync(videoPath, finalPath);
    console.log(`🎬 YouTube Demo recorded at: ${finalPath}`);
  }

  await browser.close();
  
  // If AFPLAY is still running (it shouldn't be, since audio is exactly 100s), kill it
  audioProcess.kill();
  process.exit(0);
}

runDemo().catch((err) => {
  console.error('Failed to run demo:', err);
  process.exit(1);
});
