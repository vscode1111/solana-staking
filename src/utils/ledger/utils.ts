import { LedgerHDWalletPath } from "./ledger";

export function getLedgerPathList(): LedgerHDWalletPath[] {
  const result = [{}];

  for (let i = 0; i < 10; i++) {
    result.push({ account: i });
  }
  for (let i = 0; i < 10; i++) {
    result.push({ account: 0, change: i,});
  }

  return result;
}