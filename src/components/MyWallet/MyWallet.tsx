import { ROUTE } from "@consts";
import { Button } from "@mui/material";
import { solanaService } from "@services";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function MyWallet() {
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
      {(wallet.connected && <p>Your wallet is {wallet.publicKey?.toString()}</p>) || (
        <p>Hello! Click the button to connect</p>
      )}

      <div className="multi-wrapper">
        <span className="button-wrapper">
          <WalletMultiButton />
        </span>
        {wallet.connected && <WalletDisconnectButton />}
        <Link to={`/${ROUTE.STAKE_ACCOUNTS}`}>
          <Button>Balance : {`${balance} SOL`}</Button>
        </Link>
      </div>
    </>
  );
}
