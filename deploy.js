const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  await hre.run("compile");
  const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
  console.log("Deploying SimpleStorage...");
  const simpleStorage = await SimpleStorage.deploy();
  await simpleStorage.deployed();
  console.log(`SimpleStorage deployed to: ${simpleStorage.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });