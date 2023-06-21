import { PublicKey } from "@solana/web3.js";
import { expect } from "chai";
import { Solana } from "./solana";
import { printJson } from "@utils";

describe("@solana/web3.js", () => {
  const solana = new Solana();

  // const userAccountPublicKey = new PublicKey("9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"); //Binance
  // const userAccountPublicKey = new PublicKey("98sPB6E8LyzLGakBTd6MiFupKUpi7CgLe34vpfYCjqbr"); //My
  // const userAccountPublicKey = new PublicKey("mqmcCCaaYQRVoGu1KssXBQjCRRu1XECNatFJHT5Spoj"); //My2
  const userAccountPublicKey = new PublicKey("BSHcqEiPpaczXz8yMzrogDWLkYNe2uFQopUzTQUveMQz"); //My-Ledger

  // const stakeAccountPublicKey = new PublicKey("EJRJswH9LyjhAfBWwPBvat1LQtrJYK4sVUzsea889cQt"); //Binance
  const stakeAccountPublicKey = new PublicKey("9z7ttmx8nw19bbKQEWqCUsuCV71vRLAaCoWvayTfBYHy"); //My

  // const txSignature =
  // "4BrwanrdXoB2Gqmw41FnKCge1w5ug1gLBVsczz6wSwrR3EeVTpbVFXZHfZhTFG94hEuciRgFHqhC2nMSFojzNB5f";
  // const txSignature =
  // "4daSZmRf1o1zCskeKMtZoviWAJpW858WaLvY8uY1cqMxkdq6wPyjw6jxvc7HWiwn7MMUdwpJTpJ3qCg9sEMExZZ";
  const txSignature =
  "25pQn4jt3x2pKXQNV6oBuTqK4268tScWrc8Ytuqr5kQwRnb44TfwjHoA7RbCfXEDU68RNQcVuXESptekN6kHX1Wb";

  it("getStakeAccounts", async () => {
    const stakeAccounts = await solana.getStakeAccounts(userAccountPublicKey);
    expect(stakeAccounts.length).greaterThan(0);
    console.log(printJson(stakeAccounts));
  });

  it("getAccountInfo", async () => {
    const stakeAccountInfo = await solana.getAccountInfo(stakeAccountPublicKey);
    expect(stakeAccountInfo).not.undefined;
    console.log(printJson(stakeAccountInfo));
  });

  it("getStakeAccountInfos", async () => {
    const stakeAccountInfos = await solana.getStakeAccountInfos(userAccountPublicKey);
    expect(stakeAccountInfos.length).greaterThanOrEqual(0);
    console.log(printJson(stakeAccountInfos));
  });

  it("getRewards", async () => {
    const rewards = await solana.getAllRewards(stakeAccountPublicKey, 459, 461);
    expect(rewards.length).greaterThan(0);
    console.log(printJson(rewards));
  });

  it("getRewards", async () => {
    const balance = await solana.getBalance(userAccountPublicKey);
    expect(balance).greaterThan(0);
    console.log(balance);
  });

  it("getCurrentValidators", async () => {
    const validators = await solana.getCurrentValidators();
    expect(validators.length).greaterThan(0);
    console.log(printJson(validators[0]), validators.length);
  });

  it("getSignatureStatus", async () => {
    const txStatus = await solana.getSignatureStatus(txSignature);
    expect(txSignature).not.undefined;
    console.log(printJson(txStatus));
  });

  it.only("waitSignatureStatus", async () => {
    const txStatus = await solana.waitSignatureStatus(txSignature);
    expect(txSignature).not.undefined;
    console.log(printJson(txStatus));
  });
});
