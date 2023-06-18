import { PublicKey } from "@solana/web3.js";
import { PhantomProvider, WindowWithSolana } from "@types";
import { useEffect, useState } from "react";

export function useWalletProvider() {
  const [provider, setProvider] = useState<PhantomProvider | null>(null);
  const [walletAvail, setWalletAvail] = useState(false);
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);

  useEffect(() => {
    if ("solana" in window) {
      const solWindow = window as WindowWithSolana;
      if (solWindow?.solana?.isPhantom) {
        setProvider(solWindow.solana);
        setWalletAvail(true);
        solWindow.solana.connect({ onlyIfTrusted: true });
      }
    }
  }, []);

  useEffect(() => {
    provider?.on("connect", async (publicKey: PublicKey) => {
      console.log(`connect event: ${publicKey}`);
      setConnected(true);
      setPublicKey(publicKey);
    });
    provider?.on("disconnect", () => {
      console.log("disconnect event");
      setConnected(false);
      setPublicKey(null);
    });
  }, [provider]);

  return {
    provider,
    walletAvail,
    connected,
    publicKey,
  };
}
