import type { DemoContract, AuditReport, Vulnerability } from '@/lib/types';

/* ============================================
   DEMO CONTRACTS — 6 pre-cached
   2 per chain type (1 vulnerable, 1 safe)
   ============================================ */

/* ---------- EVM: Vulnerable ---------- */
const EVM_VULNERABLE_SOURCE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

contract VulnerableVault {
    mapping(address => uint256) public balances;
    
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
    
    function withdraw() public {
        uint256 bal = balances[msg.sender];
        require(bal > 0, "No balance");
        
        // VULNERABILITY: External call before state update
        (bool sent, ) = msg.sender.call{value: bal}("");
        require(sent, "Failed to send");
        
        balances[msg.sender] = 0; // State update AFTER external call
    }
    
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
    // VULNERABILITY: No access control on critical function
    function emergencyDrain(address payable _to) public {
        _to.transfer(address(this).balance);
    }
    
    // VULNERABILITY: Integer overflow possible in Solidity <0.8.0
    function addReward(address _user, uint256 _amount) public {
        balances[_user] += _amount; // No overflow check
    }
}`;

const EVM_VULNERABLE_REPORT: AuditReport = {
  id: 'demo-evm-vuln-001',
  chainId: 'ethereum',
  chainName: 'Ethereum',
  chainType: 'evm',
  contractAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD1e',
  severity: 'CRITICAL',
  threatScore: 92,
  vulnerabilities: [
    {
      id: 'evm-reentrancy',
      name: 'Reentrancy Attack',
      severity: 'CRITICAL',
      lineReference: 'Lines 14-19',
      lineStart: 14,
      lineEnd: 19,
      description: 'The withdraw() function makes an external call to msg.sender before updating the balance state variable. An attacker can recursively call withdraw() during the external call, draining the contract of all funds before the balance is set to zero.',
      remediation: 'Apply the checks-effects-interactions pattern: update balances[msg.sender] = 0 BEFORE the external call. Additionally, add a reentrancy guard modifier (e.g., OpenZeppelin ReentrancyGuard).',
      cweId: 'CWE-841',
    },
    {
      id: 'evm-access-control',
      name: 'Missing Access Control',
      severity: 'CRITICAL',
      lineReference: 'Lines 26-28',
      lineStart: 26,
      lineEnd: 28,
      description: 'The emergencyDrain() function allows ANY external caller to drain the entire contract balance to an arbitrary address. There is no onlyOwner modifier or access control check.',
      remediation: 'Add an onlyOwner modifier using OpenZeppelin\'s Ownable contract. Restrict emergencyDrain() to the contract deployer or a multisig.',
      cweId: 'CWE-284',
    },
    {
      id: 'evm-integer-overflow',
      name: 'Integer Overflow/Underflow',
      severity: 'HIGH',
      lineReference: 'Lines 31-33',
      lineStart: 31,
      lineEnd: 33,
      description: 'The addReward() function performs unchecked arithmetic on balances in Solidity ^0.7.6. Integer overflow can wrap a user\'s balance from max uint256 back to zero, or allow inflation of balances.',
      remediation: 'Upgrade to Solidity ^0.8.0 which has built-in overflow checks, or use OpenZeppelin\'s SafeMath library for all arithmetic operations.',
      cweId: 'CWE-190',
    },
  ],
  sourceCode: EVM_VULNERABLE_SOURCE,
  language: 'solidity',
  analysisTimeMs: 3247,
  createdAt: '2026-04-09T14:23:00Z',
  summary: 'This contract contains 3 critical/high severity vulnerabilities including a classic reentrancy attack vector, completely missing access control on fund drainage, and integer overflow risk. The contract should NOT be deployed without immediate remediation.',
};

/* ---------- EVM: Safe ---------- */
const EVM_SAFE_SOURCE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract SecureVault is ERC20, Ownable, ReentrancyGuard {
    mapping(address => uint256) public deposits;
    
    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    
    constructor() ERC20("Vault Token", "VTK") Ownable(msg.sender) {}
    
    function deposit() external payable nonReentrant {
        require(msg.value > 0, "Must deposit > 0");
        deposits[msg.sender] += msg.value;
        _mint(msg.sender, msg.value);
        emit Deposited(msg.sender, msg.value);
    }
    
    function withdraw(uint256 amount) external nonReentrant {
        require(deposits[msg.sender] >= amount, "Insufficient balance");
        
        // Checks-Effects-Interactions pattern
        deposits[msg.sender] -= amount;
        _burn(msg.sender, amount);
        
        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "Transfer failed");
        emit Withdrawn(msg.sender, amount);
    }
    
    function emergencyPause() external onlyOwner {
        // Owner-only emergency function
    }
    
    receive() external payable {
        deposits[msg.sender] += msg.value;
    }
}`;

const EVM_SAFE_REPORT: AuditReport = {
  id: 'demo-evm-safe-001',
  chainId: 'ethereum',
  chainName: 'Ethereum',
  chainType: 'evm',
  contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  severity: 'SAFE',
  threatScore: 8,
  vulnerabilities: [],
  sourceCode: EVM_SAFE_SOURCE,
  language: 'solidity',
  analysisTimeMs: 2891,
  createdAt: '2026-04-09T14:25:00Z',
  summary: 'This contract follows security best practices: ReentrancyGuard prevents reentrancy, Ownable restricts admin functions, Solidity ^0.8.20 has built-in overflow checks, and the Checks-Effects-Interactions pattern is correctly applied. No vulnerabilities detected.',
};

/* ---------- SVM: Vulnerable ---------- */
const SVM_VULNERABLE_SOURCE = `use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod vulnerable_vault {
    use super::*;

    // VULNERABILITY: No signer check — anyone can call
    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        
        // Missing: is_signer check on authority
        // Missing: owner validation
        
        let transfer_ix = anchor_lang::solana_program::system_instruction::transfer(
            &vault.key(),
            &ctx.accounts.recipient.key(),
            amount,
        );
        
        anchor_lang::solana_program::program::invoke(
            &transfer_ix,
            &[
                vault.to_account_info(),
                ctx.accounts.recipient.to_account_info(),
            ],
        )?;
        
        Ok(())
    }
    
    // VULNERABILITY: Uninitialized account data used directly
    pub fn process_data(ctx: Context<ProcessData>) -> Result<()> {
        let data_account = &ctx.accounts.data_account;
        let raw_data = data_account.try_borrow_data()?;
        
        // Using uninitialized data without validation
        let value = u64::from_le_bytes(raw_data[0..8].try_into().unwrap());
        msg!("Processing value: {}", value);
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub vault: AccountInfo<'info>,
    /// CHECK: No validation on recipient
    pub recipient: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
    // Missing: authority signer field
}

#[derive(Accounts)]  
pub struct ProcessData<'info> {
    /// CHECK: No validation on data account
    pub data_account: AccountInfo<'info>,
}`;

const SVM_VULNERABLE_REPORT: AuditReport = {
  id: 'demo-svm-vuln-001',
  chainId: 'solana',
  chainName: 'Solana',
  chainType: 'svm',
  contractAddress: 'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS',
  severity: 'CRITICAL',
  threatScore: 87,
  vulnerabilities: [
    {
      id: 'svm-missing-signer',
      name: 'Missing Signer Check',
      severity: 'CRITICAL',
      lineReference: 'Lines 9-10',
      lineStart: 9,
      lineEnd: 10,
      description: 'The withdraw() instruction does not validate that the caller is an authorized signer. The Withdraw accounts struct is missing a signer constraint on an authority field. Any user can invoke this instruction and drain funds.',
      remediation: 'Add an authority: Signer field to the Withdraw accounts struct with a #[account(signer)] constraint. Verify the authority matches the vault owner before processing.',
      cweId: 'CWE-862',
    },
    {
      id: 'svm-missing-owner',
      name: 'Missing Owner Check',
      severity: 'CRITICAL',
      lineReference: 'Lines 45-50',
      lineStart: 45,
      lineEnd: 50,
      description: 'The vault AccountInfo has no owner validation. An attacker can pass in any account as the vault, potentially pointing to accounts owned by different programs.',
      remediation: 'Use Anchor\'s Account<> type instead of raw AccountInfo<>. Add #[account(owner = program_id)] constraint to verify the vault is owned by this program.',
    },
    {
      id: 'svm-uninitialized',
      name: 'Uninitialized Account Data',
      severity: 'HIGH',
      lineReference: 'Lines 33-39',
      lineStart: 33,
      lineEnd: 39,
      description: 'The process_data instruction reads raw bytes from an account without checking if the account has been properly initialized. Reading uninitialized memory can lead to unpredictable behavior or exploitable state.',
      remediation: 'Add a discriminator check or use Anchor\'s Account<> with init/has_one constraints. Validate the is_initialized field before reading data.',
      cweId: 'CWE-824',
    },
  ],
  sourceCode: SVM_VULNERABLE_SOURCE,
  language: 'rust',
  analysisTimeMs: 4102,
  createdAt: '2026-04-09T14:30:00Z',
  summary: 'This Solana program contains critical vulnerabilities: missing signer checks allow unauthorized withdrawals, missing owner validation permits account substitution attacks, and uninitialized data reads create exploitable state. Immediate remediation required before deployment.',
};

/* ---------- SVM: Safe ---------- */
const SVM_SAFE_SOURCE = `use anchor_lang::prelude::*;

declare_id!("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

#[program]
pub mod secure_vault {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.authority = ctx.accounts.authority.key();
        vault.balance = 0;
        vault.is_initialized = true;
        Ok(())
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        require!(amount > 0, VaultError::InvalidAmount);
        
        let vault = &mut ctx.accounts.vault;
        vault.balance = vault.balance
            .checked_add(amount)
            .ok_or(VaultError::Overflow)?;
            
        // Transfer SOL
        let cpi_ctx = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.depositor.to_account_info(),
                to: ctx.accounts.vault.to_account_info(),
            },
        );
        anchor_lang::system_program::transfer(cpi_ctx, amount)?;
        
        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        
        require!(vault.balance >= amount, VaultError::InsufficientFunds);
        vault.balance = vault.balance
            .checked_sub(amount)
            .ok_or(VaultError::Underflow)?;
        
        **vault.to_account_info().try_borrow_mut_lamports()? -= amount;
        **ctx.accounts.authority.try_borrow_mut_lamports()? += amount;
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = authority, space = 8 + Vault::INIT_SPACE)]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut, has_one = authority)]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub depositor: Signer<'info>,
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut, has_one = authority)]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub authority: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct Vault {
    pub authority: Pubkey,
    pub balance: u64,
    pub is_initialized: bool,
}

#[error_code]
pub enum VaultError {
    #[msg("Invalid amount")]
    InvalidAmount,
    #[msg("Insufficient funds")]
    InsufficientFunds,
    #[msg("Arithmetic overflow")]
    Overflow,
    #[msg("Arithmetic underflow")]
    Underflow,
}`;

const SVM_SAFE_REPORT: AuditReport = {
  id: 'demo-svm-safe-001',
  chainId: 'solana',
  chainName: 'Solana',
  chainType: 'svm',
  contractAddress: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  severity: 'SAFE',
  threatScore: 5,
  vulnerabilities: [],
  sourceCode: SVM_SAFE_SOURCE,
  language: 'rust',
  analysisTimeMs: 3456,
  createdAt: '2026-04-09T14:32:00Z',
  summary: 'This Anchor program follows Solana security best practices: proper Signer constraints on all authority fields, has_one validation for account ownership, checked arithmetic preventing overflow/underflow, proper Account<> types instead of raw AccountInfo, and complete error handling with custom error codes.',
};

/* ---------- Move: Vulnerable ---------- */
const MOVE_VULNERABLE_SOURCE = `module 0x1::vulnerable_token {
    use std::signer;
    
    struct TokenStore has key {
        balance: u64,
    }
    
    // VULNERABILITY: Public entry without signer parameter
    public entry fun mint_tokens(recipient: address, amount: u64) acquires TokenStore {
        let store = borrow_global_mut<TokenStore>(recipient);
        store.balance = store.balance + amount;
    }
    
    // VULNERABILITY: Missing acquires annotation
    public fun get_balance(addr: address): u64 {
        let store = borrow_global<TokenStore>(addr);
        store.balance
    }
    
    // VULNERABILITY: borrow_global_mut without existence check
    public entry fun transfer(
        from: &signer,
        to: address,
        amount: u64,
    ) acquires TokenStore {
        let from_addr = signer::address_of(from);
        let from_store = borrow_global_mut<TokenStore>(from_addr);
        
        // No check if 'to' has TokenStore — will abort
        let to_store = borrow_global_mut<TokenStore>(to);
        
        from_store.balance = from_store.balance - amount;
        to_store.balance = to_store.balance + amount;
    }
    
    // Resource created but never moved to global storage
    public fun create_token(): TokenStore {
        TokenStore { balance: 0 }
        // VULNERABILITY: Resource leak — not stored or destroyed
    }
}`;

const MOVE_VULNERABLE_REPORT: AuditReport = {
  id: 'demo-move-vuln-001',
  chainId: 'aptos',
  chainName: 'Aptos',
  chainType: 'move',
  contractAddress: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890',
  severity: 'CRITICAL',
  threatScore: 78,
  vulnerabilities: [
    {
      id: 'move-missing-signer',
      name: 'Missing signer Parameter',
      severity: 'CRITICAL',
      lineReference: 'Lines 9-12',
      lineStart: 9,
      lineEnd: 12,
      description: 'The mint_tokens() function is a public entry point that takes a recipient address and amount, but does NOT require a signer parameter. Any user can call this function to mint arbitrary tokens to any address.',
      remediation: 'Add a signer parameter and validate authorization: public entry fun mint_tokens(admin: &signer, recipient: address, amount: u64). Verify admin is the module deployer.',
    },
    {
      id: 'move-missing-acquires',
      name: 'Missing acquires Annotation',
      severity: 'MEDIUM',
      lineReference: 'Lines 15-18',
      lineStart: 15,
      lineEnd: 18,
      description: 'The get_balance() function calls borrow_global<TokenStore> but is missing the required acquires TokenStore annotation. This will cause a compilation error in Move and indicates incomplete module definition.',
      remediation: 'Add the acquires annotation: public fun get_balance(addr: address): u64 acquires TokenStore',
    },
    {
      id: 'move-unsafe-borrow',
      name: 'Unchecked borrow_global_mut',
      severity: 'HIGH',
      lineReference: 'Lines 28-30',
      lineStart: 28,
      lineEnd: 30,
      description: 'The transfer() function calls borrow_global_mut<TokenStore>(to) without first checking if the recipient address has a TokenStore resource. If the resource doesn\'t exist, the transaction will abort with a cryptic error.',
      remediation: 'Add an exists<TokenStore>(to) check before borrowing. If the resource doesn\'t exist, create it with move_to or return a descriptive error.',
    },
    {
      id: 'move-resource-leak',
      name: 'Resource Leak',
      severity: 'MEDIUM',
      lineReference: 'Lines 35-38',
      lineStart: 35,
      lineEnd: 38,
      description: 'The create_token() function creates a TokenStore resource but neither moves it to global storage (move_to) nor returns it in a way that ensures it will be stored. Move\'s linear type system prevents resource destruction, making this a leak.',
      remediation: 'Either move the resource to global storage using move_to(signer, token_store) or ensure the return value is consumed by the caller.',
    },
  ],
  sourceCode: MOVE_VULNERABLE_SOURCE,
  language: 'move',
  analysisTimeMs: 3789,
  createdAt: '2026-04-09T14:35:00Z',
  summary: 'This Move module has critical authorization flaws: the mint function accepts no signer (allowing anyone to mint tokens), unsafe global borrows that can abort transactions, and resource leaks. Found 4 vulnerabilities across all severity levels.',
};

/* ---------- Move: Safe ---------- */
const MOVE_SAFE_SOURCE = `module 0x1::secure_token {
    use std::signer;
    use aptos_framework::coin;
    use aptos_framework::managed_coin;
    
    struct SecureToken has key {}
    
    struct TokenCapabilities has key {
        mint_cap: coin::MintCapability<SecureToken>,
        burn_cap: coin::BurnCapability<SecureToken>,
        freeze_cap: coin::FreezeCapability<SecureToken>,
    }
    
    /// Initialize the token — only callable by module deployer
    public entry fun initialize(admin: &signer) {
        assert!(signer::address_of(admin) == @0x1, 1);
        
        let (burn_cap, freeze_cap, mint_cap) = coin::initialize<SecureToken>(
            admin,
            b"Secure Token",
            b"STKN",
            8,
            true,
        );
        
        move_to(admin, TokenCapabilities {
            mint_cap,
            burn_cap,
            freeze_cap,
        });
    }
    
    /// Mint tokens — requires admin signer with capabilities
    public entry fun mint(
        admin: &signer,
        recipient: address,
        amount: u64,
    ) acquires TokenCapabilities {
        let admin_addr = signer::address_of(admin);
        assert!(admin_addr == @0x1, 2);
        assert!(exists<TokenCapabilities>(admin_addr), 3);
        
        let caps = borrow_global<TokenCapabilities>(admin_addr);
        let coins = coin::mint(amount, &caps.mint_cap);
        coin::deposit(recipient, coins);
    }
    
    /// Register to receive tokens
    public entry fun register(account: &signer) {
        managed_coin::register<SecureToken>(account);
    }
    
    /// Transfer tokens between accounts
    public entry fun transfer(
        from: &signer,
        to: address,
        amount: u64,
    ) {
        coin::transfer<SecureToken>(from, to, amount);
    }
}`;

const MOVE_SAFE_REPORT: AuditReport = {
  id: 'demo-move-safe-001',
  chainId: 'aptos',
  chainName: 'Aptos',
  chainType: 'move',
  contractAddress: '0x00000000000000000000000000000000000000000000000000000000000cafe01',
  severity: 'SAFE',
  threatScore: 3,
  vulnerabilities: [],
  sourceCode: MOVE_SAFE_SOURCE,
  language: 'move',
  analysisTimeMs: 3102,
  createdAt: '2026-04-09T14:38:00Z',
  summary: 'This Move module follows Aptos security best practices: admin-only minting with signer verification, proper capability-based access control, exists<> checks before global borrows, acquires annotations on all functions accessing global state, and standard coin framework integration. No vulnerabilities detected.',
};

/* ============================================
   EXPORTS
   ============================================ */

export const DEMO_CONTRACTS: DemoContract[] = [
  {
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD1e',
    chainId: 'ethereum',
    label: 'Vulnerable EVM',
    emoji: '🔴',
    report: EVM_VULNERABLE_REPORT,
  },
  {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    chainId: 'ethereum',
    label: 'Safe EVM',
    emoji: '🟢',
    report: EVM_SAFE_REPORT,
  },
  {
    address: 'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS',
    chainId: 'solana',
    label: 'Vulnerable Solana',
    emoji: '🔴',
    report: SVM_VULNERABLE_REPORT,
  },
  {
    address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    chainId: 'solana',
    label: 'Safe Solana',
    emoji: '🟢',
    report: SVM_SAFE_REPORT,
  },
  {
    address: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890',
    chainId: 'aptos',
    label: 'Exploitable Move',
    emoji: '🔴',
    report: MOVE_VULNERABLE_REPORT,
  },
  {
    address: '0x00000000000000000000000000000000000000000000000000000000000cafe01',
    chainId: 'aptos',
    label: 'Safe Move',
    emoji: '🟢',
    report: MOVE_SAFE_REPORT,
  },
];

export function getDemoContract(address: string): DemoContract | undefined {
  return DEMO_CONTRACTS.find(
    (c) => c.address.toLowerCase() === address.toLowerCase()
  );
}

export function getDemoHistory(): AuditReport[] {
  return DEMO_CONTRACTS.map((c) => c.report);
}
