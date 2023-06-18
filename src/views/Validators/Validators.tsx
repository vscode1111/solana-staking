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
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

export function Validators() {
  const { classes } = useValidatorsStyles();
  const [validators, setValidators] = useState<ValidatorInfo[]>([]);
  const [isLoading, setLoading] = useState(false);

  const { connection } = useConnection();

  const wallet = useWallet();

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

      // const tx = SystemProgram.transfer({
      //   fromPubkey: wallet.publicKey,
      //   toPubkey: new PublicKey("mqmcCCaaYQRVoGu1KssXBQjCRRu1XECNatFJHT5Spoj"),
      //   lamports: LAMPORTS_PER_SOL * 0.01,
      // });

      // const tx = await solanaService.createStakeAccountTx(wallet.publicKey, 0.01 * LAMPORTS_PER_SOL);

      const stakeAccount = Keypair.generate();

      const createStakeAccountInstruction = StakeProgram.createAccount({
        authorized: new Authorized(wallet.publicKey, wallet.publicKey), // Here we set two authorities: Stake Authority and Withdrawal Authority. Both are set to our wallet.
        fromPubkey: wallet.publicKey,
        lamports: 0.01 * LAMPORTS_PER_SOL,
        lockup: new Lockup(0, 0, wallet.publicKey), // Optional. We'll set this to 0 for demonstration purposes.
        stakePubkey: stakeAccount.publicKey,
      });

      // const { blockhash } = await connection.getRecentBlockhash();
      // tx.recentBlockhash = blockhash;
      // tx.feePayer = wallet.publicKey;

      const stakeTransactionInstruction = StakeProgram.delegate({
        stakePubkey: stakeAccount.publicKey,
        authorizedPubkey: wallet.publicKey,
        votePubkey: new PublicKey(votePubkey),
      });

      transaction.add(createStakeAccountInstruction, stakeTransactionInstruction);

      // const signedTransaction = await wallet!.signTransaction(tx);

      const sig = await wallet.sendTransaction(transaction, connection, {
        signers: [stakeAccount],
      });
      // const sig = await sendAndConfirmTransaction(connection, transaction, [wallet, stakeAccount]);
      // const sig = await connection.sendRawTransaction(signedTransaction.serialize());
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
