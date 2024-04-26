const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleStorage", function () {
  let simpleStorageInstance, SimpleStorageContract;

  beforeEach(async function () {
    SimpleStorageContract = await ethers.getContractFactory("SimpleStorage");
    simpleStorageInstance = await SimpleStorageContract.deploy();
    await simpleStorageInstance.deployed();
  });

  it("Should correctly store and return the value 100", async function () {
    await simpleStorageInstance.store(100);
    expect(await simpleStorageInstance.retrieve()).to.equal(100);
  });

  it("Should accurately store and return the value 0", async function () {
    await simpleStorageInstance.store(0);
    expect(await simpleStorageInstance.retrieve()).to.equal(0);
  });

  it("Should reject attempts to store negative values to signify limitations", async function () {
    try {
      await simpleStorageInstance.store(-1);
      expect.fail("Negative values should not be accepted, but the contract did not revert.");
    } catch (error) {
      expect(error.message).to.include("revert", "Expected a revert error for negative value storage.");
    }
  });

  it("Should handle storage and retrieval of extremely large numbers", async function () {
    const extremelyLargeNumber = ethers.BigNumber.from("115792089237316195423570985008687907853269984665640564039457584007913129639935");
    await simpleStorageInstance.store(extremelyLargeNumber);
    expect(await simpleStorageInstance.retrieve()).to.equal(extremelyLargeNumber);
  });
});