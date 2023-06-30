import { LedgerHDWalletPath } from "./ledger2";

const ACCOUNT_COUNT = 1;

export function getLedgerPathList(): LedgerHDWalletPath[] {
  const result = [{}];

  for (let i = 0; i < ACCOUNT_COUNT; i++) {
    result.push({ account: i });
  }
  for (let i = 0; i < ACCOUNT_COUNT; i++) {
    result.push({ account: 0, change: i });
  }

  return result;
}
