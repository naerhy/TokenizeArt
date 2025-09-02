import { network } from "hardhat";
import { describe, it } from "node:test";

describe("FortyTwo", async () => {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();

  it("", async () => {
    const fortyTwo = await viem.deployContract("FortTwo");
  });
});
