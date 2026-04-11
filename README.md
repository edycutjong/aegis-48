<p align="center">
  <img src="public/logo.png" alt="Aegis-48 Logo" width="120" />
</p>

<h1 align="center">🛡️ Aegis-48</h1>
<p align="center"><strong>Cross-Chain AI Security Oracle</strong></p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2-61dafb?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/OpenAI-GPT--4o-412991?logo=openai" alt="OpenAI" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" alt="TypeScript" />
</p>

> Paste any contract address from any blockchain. Get an instant AI-powered security audit with vulnerability line references and severity scores.

Aegis-48 is a cross-chain AI security oracle built for the **[48 Weeks. 48 Blockchains.](https://dorahacks.io/hackathon/codequity-x-blockchains)** hackathon by Codequity. It audits smart contracts across EVM, Solana (SVM), and Move chains using constrained AI analysis — delivering visual RED/GREEN verdicts with zero hallucination.

---

## 🎯 Problem

When you learn 48 blockchain SDKs in 48 weeks, you write insecure code. Not because you're a bad developer — because security patterns are chain-specific:

- ❌ Missing **signer check** in Solana
- ❌ **Reentrancy vector** in Ethereum
- ❌ Unchecked `borrow_global_mut` in Aptos

No existing tool audits across all chains. Until now.

## 💡 Solution

**Aegis-48** fetches any contract from any chain, runs it through a constrained AI security analyzer (OpenAI Structured Outputs), and delivers a visual verdict:

- 🔴 **RED** flash for critical vulnerabilities — with exact line references and remediation
- 🟢 **GREEN** flash for safe contracts — with option to mint a verifiable NFT credential

**Key features:**
- **Single search bar** — paste any address from any supported chain
- **Sonar-style scanning animation** — live progress through fetch → decompile → analyze stages
- **Structured AI analysis** — constrained vulnerability checklist per chain type eliminates hallucination
- **Audit history dashboard** — track all past audits with severity distribution
- **NFT credentials** — mint "Aegis Verified" badges for safe contracts

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Next.js 16 App Router                  │
├──────────────────┬──────────────────────────────────────┤
│  Client          │  React 19 + Framer Motion            │
│  ┌────────────┐  │  Search → Scan Animation → Verdict   │
│  │ SearchBar  │→ │  → Vulnerability Cards → History     │
│  └────────────┘  │                                      │
├──────────────────┼──────────────────────────────────────┤
│  API Routes      │  /api/audit — run AI security scan   │
│                  │  /api/history — fetch past audits     │
├──────────────────┼──────────────────────────────────────┤
│  AI Engine       │  OpenAI GPT-4o Structured Outputs    │
│                  │  6 vulnerability patterns per chain   │
│                  │  18 total across EVM/SVM/Move         │
├──────────────────┼──────────────────────────────────────┤
│  Chain Adapters  │  EVM: viem (bytecode fetch)          │
│                  │  SVM: @solana/web3.js                │
│                  │  Move: Aptos REST API                │
├──────────────────┼──────────────────────────────────────┤
│  Data Layer      │  Supabase (audit cache + history)    │
│                  │  Demo contracts for instant results   │
└──────────────────┴──────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer       | Technology                          |
| ----------- | ----------------------------------- |
| Framework   | Next.js 16.2.3 (App Router)         |
| UI          | React 19.2.4                        |
| Styling     | Tailwind CSS v4 + CSS custom props  |
| Animations  | Framer Motion 12                    |
| AI          | OpenAI GPT-4o (Structured Outputs)  |
| Icons       | Lucide React                        |
| Language    | TypeScript 5                        |
| Testing     | Jest + ts-jest (100% Backend Auth)  |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
git clone https://github.com/edycutjong/aegis-48.git
cd aegis-48
npm install
```

### Environment Variables

To use the real EVM AI security engine, rename `.env.example` to `.env` and configure:

```bash
OPENAI_API_KEY=your_openai_key
ALCHEMY_API_KEY=your_alchemy_key  # Optional, fallback available
```

### Run Development Server

```bash
npm run dev
```

### Run Tests (100% Backend Coverage)

```bash
npm run test:coverage
```

Open [http://localhost:3000](http://localhost:3000) to see the security oracle.

> **Note (Hybrid Prod Engine):** The engine operates as a hybrid. For presentation safety, 6 pre-loaded demo contracts return instant reports. Any unknown Ethereum/EVM contract will hit real RPC nodes via Viem to fetch bytecode and analyze it using OpenAI. Solana and Aptos inputs use a deterministic mock fallback.

---

## 📁 Project Structure

```
aegis-48/
├── src/
│   ├── app/
│   │   ├── api/             # API routes for audit execution
│   │   ├── audit/           # Audit results page
│   │   ├── history/         # Audit history dashboard
│   │   ├── globals.css      # Design tokens + verdict flash animations
│   │   ├── layout.tsx       # Root layout with metadata
│   │   └── page.tsx         # Hero search page with scan animation
│   ├── components/
│   │   ├── SearchBar.tsx    # Glassmorphism address input
│   │   ├── ScanAnimation.tsx # Sonar-ring scanning effect
│   │   └── ExampleChip.tsx  # Demo contract quick-select chips
│   ├── data/
│   │   └── demo-contracts.ts # Pre-loaded demo addresses
│   └── lib/
│       ├── analyzer.ts      # Hybrid Viem+OpenAI engine & mocks
│       ├── analyzer.test.ts # 100% coverage unit tests
│       ├── schema.ts        # Zod structures for OpenAI definitions
│       ├── constants.ts     # Chain configs + mock stats
│       └── utils.ts         # Utility functions (cn, etc.)
├── package.json
├── jest.config.js
├── jest.setup.ts
├── tsconfig.json
└── next.config.ts
```

---

## 🎨 Demo Flow

1. **Landing** — Minimalist dark-mode hero with glassmorphism search bar and chain icons
2. **Click Example** — Select "🔴 Vulnerable EVM" chip to auto-fill a known-bad contract
3. **Scan Animation** — Concentric sonar rings pulse with progress stages
4. **RED Verdict** — Screen flashes red: "CRITICAL" with vulnerability cards showing line references
5. **Try Safe** — Select "🟢 Safe Solana" → screen flashes green: "SAFE" verdict

---

## 🌐 Supported Chains

- **EVM**: Ethereum, Arbitrum, Polygon, Base, Optimism, Avalanche, BSC
- **SVM**: Solana
- **Move**: Aptos, Sui

---

## 🏆 Hackathon Context

**Competition:** [48 Weeks. 48 Blockchains.](https://dorahacks.io/hackathon/codequity-x-blockchains) by Codequity  
**Track:** Core Codequity Track / Adapting to Different SDKs  
**Core Thesis:** While other participants build 48 isolated dApps, a single cross-chain meta-tool demonstrates deeper ecosystem understanding — and gives every Codequity developer a security safety net.

---

## 📹 Demo

> 🎥 [Watch Demo Video](#) | 🌐 [Live Demo](#)

---

## 📄 License

MIT © 2026 [Edy Cu](https://github.com/edycutjong)
