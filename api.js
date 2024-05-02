require('dotenv').config();
const Web3 = require('web3');
const contractABI = require('./SimpleStorageABI.json');

const privateKey = process.env.PRIVATE_KEY;
const contractAddress = process.env.CONTRACT_ADDRESS;
const providerURL = process.env.PROVIDER_URL;

let web3 = new Web3(new Web3.providers.HttpProvider(providerURL));
let SimpleStorageContract = new web3.eth.Contract(contractABI, contractAddress);

let account;

async function setup() {
    try {
        const accounts = await web3.eth.getAccounts();
        if (accounts.length === 0) throw new Error("No accounts found. Ensure your provider is correctly configured.");
        account = accounts[0];
    } catch (err) {
        console.error('Setup Error: Failed to initialize account. Details:', err.message || err);
        throw err; // Re-throw to signal setup failure
    }
}

async function estimateGas(tx, account) {
    try {
        return await tx.estimateGas({ from: account });
    } catch (err) {
        console.error('Estimate Gas Error: Failed to estimate gas. Details:', err.message || err);
        throw err; // Re-throw to manage upstream
    }
}

async function getGasPriceAndNonce(account) {
    try {
        const gasPrice = await web3.eth.getGasPrice();
        const nonce = await web3.eth.getTransactionCount(account);
        if (!gasPrice || !Number.isFinite(nonce)) throw new Error("Failed to retrieve gas price or nonce.");
        return { gasPrice, nonce };
    } catch (err) {
        console.error('Gas Price & Nonce Error: Failed to retrieve necessary transaction parameters. Details:', err.message || err);
        throw err; // Ensuring errors are caught and handled appropriately
    }
}

async function signAndSendTransaction(txObject, privateKey) {
    try {
        const signedTx = await web3.eth.accounts.signTransaction(txObject, privateKey);
        if (!signedTx.rawTransaction) throw new Error("Failed to sign transaction.");
        return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    } catch (err) {
        console.error('Sign and Send Transaction Error: Failed to sign or send the transaction. Details:', err.message || err);
        throw err; // Error propagated to calling function for handling
    }
}

async function storeData(value) {
    try {
        const tx = SimpleStorageContract.methods.store(value);
        const gas = await estimateGas(tx, account);
        const { gasPrice, nonce } = await getGasPriceAndNonce(account);

        if (!gas || !gasPrice || nonce === undefined) throw new Error("Transaction parameters invalid.");

        const data = tx.encodeABI();

        const txObject = {
            to: contractAddress,
            data,
            gas,
            gasPrice,
            nonce,
            chainId: 3 // Adjust based on network
        };

        await signAndSendTransaction(txObject, privateKey)
            .then(receipt => console.log('Transaction receipt:', receipt))
            .catch(err => console.error('Error sending transaction:', err.message || err));
    } catch (err) {
        console.error('Store Data Error: Failed to store data. Details:', err.message || err);
    }
}

async function incrementStoredValue(amount) {
    try {
        const tx = SimpleStorageContract.methods.increment(amount);
        const gas = await estimateGas(tx, account);
        const { gasPrice, nonce } = await getGasPriceAndNonce(account);
        
        if (!gas || !gasPrice || nonce === undefined) throw new Error("Transaction parameters invalid.");

        const data = tx.encodeABI();

        const txObject = {
            to: contractAddress,
            data,
            gas,
            gasPrice,
            nonce,
            chainId: 3 // Remember to adjust this based on your network
        };

        await signAndSendTransaction(txObject, privateKey)
            .then(receipt => console.log('Increment transaction receipt:', receipt))
            .catch(err => console.error('Error incrementing value:', err.message || err));
    } catch (err) {
        console.error('Increment Stored Value Error: Failed to increment value. Details:', err.message || err);
    }
}

async function retrieveData() {
    try {
        return await SimpleStorageContract.methods.retrieve().call();
    } catch (err) {
        console.error('Retrieve Data Error: Failed to retrieve data. Details:', err.message || err);
        throw err; // re-throw the error if needed or handle it as per your logic
    }
}

function setupEventListeners() {
    document.getElementById("storeButton").addEventListener("click", function () {
        let value = document.getElementById("valueToStore").value;
        storeData(value).then(() => {
            console.log("Data stored successfully");
        }).catch(err => {
            console.log("Error storing data:", err.message || err);
        });
    });

    document.getElementById("incrementButton").addEventListener("click", function () {
        let amount = document.getElementById("incrementAmount").value;
        incrementStoredValue(amount).then(() => {
            console.log("Value incremented successfully");
        }).catch(err => {
            console.log("Error incrementing value:", err.message || err);
        });
    });

    document.getElementById("retrieveButton").addEventListener("click", function () {
        retrieveData().then(value => {
            console.log("Retrieved value:", value);
            document.getElementById("retrievedValue").innerText = `Retrieved Value: ${value}`;
        }).catch(err => {
            console.log("Error retrieving data:", err.message || err);
        });
    });
}

setup().then(() => {
    console.log('Web3 setup complete.');
    setupEventListeners();
}).catch(err => console.error('Web3 setup failed:', err.message || err));