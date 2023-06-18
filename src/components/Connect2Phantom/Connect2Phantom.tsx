import { useEffect, useState } from "react";
import { solanaService } from "@services";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { ROUTE } from "@consts";
import { useWalletProvider } from "@hooks";

export function Connect2Phantom() {
  const { provider, walletAvail, connected, publicKey } = useWalletProvider();

  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const asyncCall = async () => {
      if (connected && publicKey) {
        const balance = await solanaService.getBalance(publicKey);
        setBalance(balance);
      }
    };
    asyncCall();
  }, [connected, publicKey, setBalance]);

  const connectHandler: React.MouseEventHandler<HTMLButtonElement> = (_event) => {
    console.log(`connect handler`);
    provider?.connect().catch((err) => {
      console.error("connect ERROR:", err);
    });
  };

  const disconnectHandler: React.MouseEventHandler<HTMLButtonElement> = (_event) => {
    console.log("disconnect handler");
    provider?.disconnect().catch((err) => {
      console.error("disconnect ERROR:", err);
    });
  };

  return (
    <div>
      {walletAvail ? (
        <>
          <button disabled={connected} onClick={connectHandler}>
            Connect to Phantom
          </button>
          <Button disabled={connected} onClick={connectHandler}>
            Connect to Phantom
          </Button>
          <button disabled={!connected} onClick={disconnectHandler}>
            Disconnect from Phantom
          </button>
          {connected ? (
            <div>
              <p>Public key : {publicKey?.toBase58()}</p>
              <Link to={`/${ROUTE.STAKE_ACCOUNTS}`}>
                <Button>Balance : {`${balance} SOL`}</Button>
              </Link>
            </div>
          ) : null}
        </>
      ) : (
        <>
          <p>
            Opps!!! Phantom is not available. Go get it{" "}
            <a href="https://phantom.app/">https://phantom.app/</a>.
          </p>
        </>
      )}
    </div>
  );
}
