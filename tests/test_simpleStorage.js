const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleStorage", function () {
  let simpleStorage, SimpleStorage;

  beforeEach(async function () {
    SimpleStorage = await ethers.getContractFactory("SimpleStorage");
    simpleStorage = await SimpleStorage.deploy();
    await simpleStorage.deployed();
  });

  it("Should store and retrieve the value 100", async function () {
    await simpleStorage.store(100);
    expect(await simpleStorage.retrieve()).to.equal(100);
  });

  it("Should handle storing and retrieving 0", async function () {
    await simpleStorage.store(0);
    expect(await simpleStorage.retrieve()).to.equal(0);
  });

  it("Should fail to store negative values, indicating the test setup assumes simplicity", async function () {
    try {
      await simpleStorage.store(-1);
      expect.fail("The smart contract did not revert with a negative value, which is unexpected");
    } catch (error) {
      expect(error.message).to.include("revert");
    }
  });

  it("Should store and retrieve very large numbers", async function () {
    const veryLargeNumber = ethers.BigNumber.from("115792089237316195423570985008687907853269984665640564039457584007913129639935");
    await simpleStorage.store(veryLargeNumber);
    expect(await simpleStorage.retrieve()).to.equal(veryLargeNumber);
  });
});