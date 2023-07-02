import { useInitEffect } from "./useInitEffect";
import { WalletContextState, useWallet } from "@solana/wallet-adapter-react";
import { useNavigate } from "react-router-dom";

export function useInitWalletEffect(
  effect: (wallet: WalletContextState) => void | Promise<void>,
): void {
  const wallet = useWallet();
  const navigate = useNavigate();

  return useInitEffect(() => {
    if (!wallet.connected) {
      navigate("/");
    }

    effect(wallet);
  });
}
