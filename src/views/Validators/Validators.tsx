import { Link } from "react-router-dom";
import { useValidatorsStyles } from "./useValidatorsStyles";
import { ROUTE } from "@/consts";
import { Button } from "@mui/material";
import { ValidatorInfo, solanaService } from "@/services";
import { useEffect, useState } from "react";
import { Loader } from "@/components";
import { uid } from "react-uid";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Authorized,
  Keypair,
  LAMPORTS_PER_SOL,
  Lockup,
  PublicKey,
  StakeProgram,
  Transaction,
} from "@solana/web3.js";
import { useStake } from "@/context";
import { useNavigate } from "react-router-dom";
import { printSol } from "@/utils";

const SEPARATE_TX = true;

export function Validators() {
  const { classes } = useValidatorsStyles();
  const [validators, setValidators] = useState<ValidatorInfo[]>([]);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { connection } = useConnection();
  const wallet = useWallet();

  const { stakeAccountInfos } = useStake();

  console.log(111, wallet.connected, wallet.publicKey);

  console.log(777, stakeAccountInfos);

  useEffect(() => {
    if (!wallet.connected) {
      navigate("/");
    }

    const asyncCall = async () => {
      if (wallet.connected && wallet.publicKey) {
        setLoading(true);
        try {
          const validators = await solanaService.getCurrentValidators(10);
          setValidators(validators);
        } catch (e) {
          console.log(e);
        }
        setLoading(false);
      }
    };
    asyncCall();
  }, [wallet]);

  const handleClick = async (votePubkey: string) => {
    if (wallet && wallet.publicKey) {
      const transaction1 = new Transaction();

      const stakeAccount = Keypair.generate();

      transaction1.add(
        StakeProgram.createAccount({
          authorized: new Authorized(wallet.publicKey, wallet.publicKey),
          fromPubkey: wallet.publicKey,
          lamports: 0.1 * LAMPORTS_PER_SOL,
          lockup: new Lockup(0, 0, wallet.publicKey),
          stakePubkey: stakeAccount.publicKey,
        }),
      );

      transaction1.add(
        StakeProgram.delegate({
          stakePubkey: stakeAccount.publicKey,
          authorizedPubkey: wallet.publicKey,
          votePubkey: new PublicKey(votePubkey),
        }),
      );

      const foundStakeAccountInfo = stakeAccountInfos.find(
        (info) => info.validator === votePubkey && info.status.toLowerCase() === "activating",
      );
      console.log(222, foundStakeAccountInfo?.stakeAccount);

      if (!SEPARATE_TX) {
        if (foundStakeAccountInfo) {
          transaction1.add(
            StakeProgram.merge({
              sourceStakePubKey: stakeAccount.publicKey,
              stakePubkey: new PublicKey(foundStakeAccountInfo.stakeAccount),
              authorizedPubkey: wallet.publicKey,
            }),
          );
        }
      }

      const signature1 = await wallet.sendTransaction(transaction1, connection, {
        signers: [stakeAccount],
      });

      console.log(777, signature1);

      let txStatus = await solanaService.waitSignatureStatus(signature1);
      console.log(888, txStatus);

      if (SEPARATE_TX) {
        if (foundStakeAccountInfo) {
          const transaction2 = new Transaction();
          transaction2.add(
            StakeProgram.merge({
              sourceStakePubKey: stakeAccount.publicKey,
              stakePubkey: new PublicKey(foundStakeAccountInfo.stakeAccount),
              authorizedPubkey: wallet.publicKey,
            }),
          );

          const signature2 = await wallet.sendTransaction(transaction2, connection);
          console.log(777, signature1);
          txStatus = await solanaService.waitSignatureStatus(signature2);
          console.log(999, txStatus);
        }
      }
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.navigation}>
        <Link to={`/${ROUTE.STAKE_ACCOUNTS}`}>
          <Button>Back</Button>
        </Link>
      </div>
      <div className={classes.content}>
        {isLoading ? (
          <Loader size={40} />
        ) : (
          <>
            {validators.map((info) => (
              <Button key={uid(info)} onClick={() => handleClick(info.votePubkey)}>
                {info.votePubkey} - {printSol(info.activatedStake)}
              </Button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
