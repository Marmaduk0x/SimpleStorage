const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  try {
    // Compile contracts
    console.log("Compiling contracts...");
    await hre.run("compile");
    console.log("Contracts compiled successfully.");

    // Deploy SimpleStorage
    const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
    console.log("Deploying SimpleStorage...");
    const simpleStorage = await SimpleStorage.deploy();
    
    // Wait for the contract to be deployed
    await simpleStorage.deployed();
    console.log(`SimpleStorage deployed to: ${simpleStorage.address}`);

  } catch (error) {
    console.error("An error occurred during the deployment process:", error);
    process.exit(1); // Exit process with failure
  }
}

main()
  .then(() => process.exit(0)) // Normal exit
  .catch((error) => {
    console.error("Unexpected error outside try-catch block:", error);
    process.exit(1); // Exit process with failure
  });