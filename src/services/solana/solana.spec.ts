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

  it.only("getStakeAccountInfos", async () => {
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
});
