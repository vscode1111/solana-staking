import { useMemo } from "react";
import "./App.css";
import "./styles.css";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { MainRouter } from "@/views";
import { ThemeProvider } from "@mui/material";
import { theme } from "@/themes";
import { LedgerWalletAdapter1 } from "@/utils";
import { LedgerDialog, Modals, TxModals } from "./components";
import { observer } from "mobx-react";
import { useStores } from "./hooks";
import { BASE_RPC_URL } from "./consts";

const endpoint = BASE_RPC_URL;

export const App = observer(() => {
  const network = WalletAdapterNetwork.Mainnet;

  // const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  console.log(111, network, endpoint);

  const { ledger, modals } = useStores();

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking --
  // Only the wallets you configure here will be compiled into your application
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      // new LedgerWalletAdapter(),
      // new LedgerWalletAdapter({ derivationPath: getDerivationPath(0) }), //works
      // new LedgerWalletAdapter1({ derivationPath: getDerivationPath(0) }), //works
      new LedgerWalletAdapter1({
        onConnecting: async (adapter) => {
          ledger.setAdapter(adapter);
          await modals.openModal(() => <LedgerDialog />);
          return ledger.selectedAccount;
        },
      }),
    ],
    [network, ledger, modals],
  );

  return (
    <div className="top-wrapper">
      <div className="App">
        <ThemeProvider theme={theme}>
          <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets}>
              <MainRouter />
              <Modals />
              <TxModals />
            </WalletProvider>
          </ConnectionProvider>
        </ThemeProvider>
      </div>
    </div>
  );
});
