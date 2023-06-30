import { useEffect, useMemo } from "react";
import "./App.css";
import "./styles.css";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  getDerivationPath,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { StakeProvider } from "@/context";
import { MainRouter } from "@/views";
import { ThemeProvider } from "@mui/material";
import { theme } from "@/themes";
import { LedgerWalletAdapter1 } from "@/utils";
import { LedgerDialog, Modals } from "./components";
import { observer } from "mobx-react";
import { useStores } from "./hooks";

export const App = observer(() => {
  const network = WalletAdapterNetwork.Mainnet;

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const { ledger, modals } = useStores();

  console.log(111, getDerivationPath(0, 0).toString("utf-8"));

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking --
  // Only the wallets you configure here will be compiled into your application
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      // new LedgerWalletAdapter({ derivationPath: getDerivationPath(0, 0) }),
      new LedgerWalletAdapter1({
        onConnecting: async (adapter) => {
          ledger.setAdapter(adapter);
          await new Promise((res) => {
            modals.openModal(
              () => <LedgerDialog />,
              () => res(0),
            );
          });

          return ledger.selectedAccount;
        },
      }),
      // new LedgerWalletAdapter(),
    ],
    [network, ledger, modals],
  );

  useEffect(() => {
    const call = async () => {
      // const ledger = new LedgerWalletAdapter2();
      // await ledger.connect();
      // const paths = getLedgerPathList();
      // const accounts = await ledger.fetchAccountsForPaths(paths);
      // console.log(777, accounts);
    };

    call();
  }, []);

  return (
    <div className="top-wrapper">
      <div className="App">
        <ThemeProvider theme={theme}>
          <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets}>
              <StakeProvider>
                <MainRouter />
                <Modals />
              </StakeProvider>
            </WalletProvider>
          </ConnectionProvider>
        </ThemeProvider>
      </div>
    </div>
  );
});
