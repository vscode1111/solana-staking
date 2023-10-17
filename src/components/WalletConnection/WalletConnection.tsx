import "./WalletConnection.css";
import { ROUTE } from "@/consts";
import { Button } from "@mui/material";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { printSol } from "@/utils";
import { observer } from "mobx-react-lite";
import { useStores } from "@/hooks";
import { Loader } from "../Loader";

export const MyWallet = observer(() => {
  const wallet = useWallet();
  const { staking } = useStores();
  const { balance, isFetching } = staking;

  console.log(111, wallet, wallet.wallet?.adapter?.name,  wallet.connecting);

  useEffect(() => {
    wallet.publicKey && staking.fetchBalance(wallet.publicKey);
  }, [wallet]);

  return (
    <>
      <div className="multi-wrapper">
        <span className="button-wrapper">
          <WalletModalProvider>
            <WalletMultiButton />
            <Button onClick={async () => {
              if (wallet.connected) {
                await wallet.disconnect();
              }
              // wallet.select('Solflare');
              wallet.select('Phantom');
              await wallet.connect();
            }}>

              Connect
            </Button>
            {wallet.connected && (
              <Link to={`/${ROUTE.STAKE_ACCOUNTS}`}>
                <Button>
                  {isFetching && <Loader size={25} />} Balance : {printSol(balance)}
                </Button>
              </Link>
            )}
          </WalletModalProvider>
        </span>
      </div>
    </>
  );
});
