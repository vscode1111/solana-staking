import { FC, useEffect, useMemo } from "react";
import "./App.css";
import "./styles.css";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
  getDerivationPath,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { StakeProvider } from "@/context";
import { MainRouter } from "@/views";
import { Button, ThemeProvider } from "@mui/material";
import { theme } from "@/themes";
import { LedgerWalletAdapter2, getLedgerPathList } from "@/utils";
import { stores } from "@/stores";
import { StoreContext } from "./hooks";

export const App: FC = () => {
  const network = WalletAdapterNetwork.Mainnet;

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  console.log(111, getDerivationPath(0, 0).toString("utf-8"));

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking --
  // Only the wallets you configure here will be compiled into your application
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter({ derivationPath: getDerivationPath(0, 0) }),
      // new LedgerWalletAdapter({ derivationPath: Buffer.from("m/44'/501'/0'/0'") }),
      // new LedgerWalletAdapter(),
      new SolletWalletAdapter({ network }),
      new SolletExtensionWalletAdapter({ network }),
    ],
    [network],
  );

  useEffect(() => {
    const call = async () => {
      const ledger = new LedgerWalletAdapter2();
      await ledger.connect();

      const paths = getLedgerPathList();

      const accounts = await ledger.fetchAccountsForPaths(paths);
      console.log(777, accounts);
    };

    call();
  }, []);

  return (
    <div className="top-wrapper">
      <div className="App">
        <StoreContext.Provider value={stores}>
          <ThemeProvider theme={theme}>
            <ConnectionProvider endpoint={endpoint}>
              <WalletProvider wallets={wallets}>
                <StakeProvider>
                  <Button
                    onClick={async () => {
                      const ledger = new LedgerWalletAdapter2();
                      await ledger.connect();
                    }}
                  >
                    Connect
                  </Button>
                  <MainRouter />
                </StakeProvider>
              </WalletProvider>
            </ConnectionProvider>
          </ThemeProvider>
        </StoreContext.Provider>
      </div>
    </div>
  );
};
