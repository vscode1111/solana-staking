import { Link } from "react-router-dom";
import { useValidatorsStyles } from "./useValidatorsStyles";
import { ROUTE } from "@consts";
import { Button } from "@mui/material";
import { ValidatorInfo, solanaService } from "@services";
import { useEffect, useState } from "react";
import { Loader } from "@components";
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
import { useStake } from "@context";

export function Validators() {
  const { classes } = useValidatorsStyles();
  const [validators, setValidators] = useState<ValidatorInfo[]>([]);
  const [isLoading, setLoading] = useState(false);

  const { connection } = useConnection();

  const wallet = useWallet();

  const { stakeAccountInfos } = useStake();

  console.log(111, stakeAccountInfos);

  useEffect(() => {
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
      const transaction = new Transaction();

      const stakeAccount = Keypair.generate();

      transaction.add(StakeProgram.createAccount({
        authorized: new Authorized(wallet.publicKey, wallet.publicKey),
        fromPubkey: wallet.publicKey,
        lamports: 0.01 * LAMPORTS_PER_SOL,
        lockup: new Lockup(0, 0, wallet.publicKey),
        stakePubkey: stakeAccount.publicKey,
      }));

      transaction.add(StakeProgram.delegate({
        stakePubkey: stakeAccount.publicKey,
        authorizedPubkey: wallet.publicKey,
        votePubkey: new PublicKey(votePubkey),
      }));

      const foundStakeAccountInfo = stakeAccountInfos.find(info => info.validator === votePubkey);

      if (foundStakeAccountInfo) {
        console.log(222, foundStakeAccountInfo.stakeAccount);
        transaction.add(StakeProgram.merge({
          sourceStakePubKey: stakeAccount.publicKey,
          stakePubkey: new PublicKey(foundStakeAccountInfo.stakeAccount),
          authorizedPubkey: wallet.publicKey,
        }));
      }

      const sig = await wallet.sendTransaction(transaction, connection, {
        signers: [stakeAccount],
      });

      console.log(777, sig);
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
                {info.votePubkey} - {info.activatedStake?.toFixed(3)}
              </Button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
