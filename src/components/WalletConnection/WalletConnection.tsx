import { ROUTE } from '@consts';
import { Button } from '@mui/material';
import { solanaService } from '@services';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  WalletModalProvider,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

export const MyWallet: React.FC = () => {
  const [balance, setBalance] = useState(0);

  const wallet = useWallet();

  useEffect(() => {
    const asyncCall = async () => {
      if (wallet.connected && wallet.publicKey) {
        try {
          const balance = await solanaService.getBalance(wallet.publicKey);
          setBalance(balance);
        } catch (e) {
          console.log(e);
        }
      }
    };
    asyncCall();
  }, [wallet]);


  return (
    <>
      <div className="multi-wrapper">
        <span className="button-wrapper">
          <WalletModalProvider>
            <WalletMultiButton />
            <Link to={`/${ROUTE.STAKE_ACCOUNTS}`}>
              <Button>Balance : {`${balance} SOL`}</Button>
            </Link>
          </WalletModalProvider>
        </span>
      </div>
    </>
  );
};
