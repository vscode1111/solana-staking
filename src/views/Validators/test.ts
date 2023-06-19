// import { Connection, Keypair, PublicKey, StakeProgram, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js';

// async function increaseStakeAmount(stakeAccountPublicKey: PublicKey, additionalAmount: number) {
//   try {
//     // Connect to a Solana network cluster
//     const connection = new Connection('https://api.mainnet-beta.solana.com');

//     // Generate a new keypair for the transaction
//     const senderKeyPair = Keypair.generate();

//     // Fetch the stake account details
//     const stakeAccountInfo = await connection.getAccountInfo(stakeAccountPublicKey);

//     // Get the current rent exemption
//     const rentExemption = await connection.getMinimumBalanceForRentExemption(0);

//     // Build the transaction to increase stake amount
//     const transaction = new Transaction();

//     // Add an instruction to transfer additional SOL to the stake account
//     transaction.add(
//       SystemProgram.transfer({
//         fromPubkey: senderKeyPair.publicKey,
//         toPubkey: stakeAccountPublicKey,
//         lamports: additionalAmount,
//       })
//     );

//     // Add an instruction to delegate the increased stake amount to the validator
//     transaction.add(
//       StakeProgram.delegate({
//         stakePubkey: stakeAccountPublicKey,
//         authorizedPubkey: senderKeyPair.publicKey,
//         votePubkey: stakeAccountInfo?.delegatedVotePubkey,
//       })
//     );

//     // Sign and send the transaction
//     const { blockhash } = await connection.getRecentBlockhash();
//     transaction.recentBlockhash = blockhash;
//     transaction.feePayer = senderKeyPair.publicKey;
//     transaction.sign(senderKeyPair);
//     const signature = await connection.sendRawTransaction(transaction.serialize());

//     console.log('Stake amount increased successfully.');
//     console.log('Transaction signature:', signature);
//   } catch (error) {
//     console.error('Error:', error);
//   }
// }

// // Specify the stake account public key and the additional amount to stake
// const stakeAccountPublicKey = new PublicKey('<STAKE_ACCOUNT_PUBLIC_KEY>');
// const additionalAmount = 100; // Replace with the actual additional amount in SOL

// // Call the function to increase the stake amount
// increaseStakeAmount(stakeAccountPublicKey, additionalAmount);
