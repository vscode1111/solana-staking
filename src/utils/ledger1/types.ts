import { PublicKey } from "@solana/web3.js";

export interface LedgerHDWalletPath {
  account?: number;
  change?: number;
}

export interface LedgerHDWalletAccount extends LedgerHDWalletPath {
  publicKey: PublicKey;
  balance?: number;
}
