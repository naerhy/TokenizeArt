import { network } from "hardhat";
import assert from "node:assert/strict";
import { suite, test } from "node:test";

suite("FortyTwo", async () => {
  const { viem } = await network.connect();
  const [wallet] = await viem.getWalletClients();
  const fortyTwo = await viem.deployContract("FortyTwo", undefined, {
    client: {
      wallet
    }
  });

  test("By default addresses should not be authorized", async () => {
    const [address] = await wallet.getAddresses();
    assert.equal(await fortyTwo.read.isAuthorized([address]), false);
  });

  test("Address should be authorized after modifying status", async () => {
    const [address] = await wallet.getAddresses();
    await fortyTwo.write.setAuthorizationStatus([address, true]);
    assert.equal(await fortyTwo.read.isAuthorized([address]), true);
  });

  test("Mint a NFT", async () => {
    // TODO
    // await fortyTwo.write.mintNFT([""]);
  });
});
