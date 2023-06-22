import React, { FC, useMemo } from 'react';
// import logo from "./logo.svg";
import "./App.css";
import "./styles.css";
// require('@solana/wallet-adapter-react-ui/styles.css');
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from "@solana/web3.js";
import { MyWallet } from "@components/WalletConnection/WalletConnection";
import { StakeProvider } from '@context';
import { MainRouter } from '@views';
// import twitterLogo from './assets/twitter-logo.svg'; 
// import discordLogo from './assets/discord.png';
// import logo from 'url:./assets/soluminati.png';

export const App: FC = () => {
  const network = WalletAdapterNetwork.Mainnet;

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking --
  // Only the wallets you configure here will be compiled into your application
  const wallets = React.useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
      new SolletWalletAdapter({ network }),
      new SolletExtensionWalletAdapter({ network }),
    ],
    [network]
  );

  return (
    <div className="top-wrapper">
      <div className="App">
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets}>
            <StakeProvider>
              <MainRouter />
            </StakeProvider>
          </WalletProvider>
        </ConnectionProvider>
      </div>
    </div>
  );
};
