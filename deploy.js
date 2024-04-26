const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  try {
    await hre.run("compile");

    const SimpleStorage = await ethers.getContractFactory("SimpleStorage"); 
    console.log("Deploying SimpleStorage...");

    const simpleStorage = await SimpleStorage.deploy(); 
    await simpleStorage.deployed();
    console.log(`SimpleStorage deployed to: ${simpleStorage.address}`);
  } catch (error) {
    console.error("An error occurred during the deployment process:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("An unexpected error occurred:", error);
    process.exit(1);
  });