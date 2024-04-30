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
        account = (await web3.eth.getAccounts())[0];
    } catch (err) {
        console.error('Setup Error:', err);
        throw err; // Re-throw to signal setup failure
    }
}

async function estimateGas(tx, account) {
    try {
        return await tx.estimateGas({ from: account });
    } catch (err) {
        console.error('Estimate Gas Error:', err);
        throw err; // Re-throw to manage upstream
    }
}

async function getGasPriceAndNonce(account) {
    try {
        const gasPrice = await web3.eth.getGasPrice();
        const nonce = await web3.eth.getTransactionCount(account);
        return { gasPrice, nonce };
    } catch (err) {
        console.error('Gas Price & Nonce Error:', err);
        throw err; // Ensuring errors are caught and handled appropriately
    }
}

async function signAndSendTransaction(txObject, privateKey) {
    try {
        const signedTx = await web3.eth.accounts.signTransaction(txObject, privateKey);
        return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    } catch (err) {
        console.error('Sign and Send Transaction Error:', err);
        throw err; // Error propagated to calling function for handling
    }
}

async function storeData(value) {
    try {
        const tx = SimpleStorageContract.methods.store(value);
        const gas = await estimateGas(tx, account);
        const { gasPrice, nonce } = await getGasPriceAndNonce(account);

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
            .then(receipt => console.log('Transaction receipt', receipt))
            .catch(err => console.error('Error sending transaction', err));
    } catch (err) {
        console.error('Store Data Error:', err);
    }
}

async function retrieveData() {
    try {
        return await SimpleStorageContract.methods.retrieve().call();
    } catch (err) {
        console.error('Retrieve Data Error:', err);
        throw err; // re-throw the error if needed or handle it as per your logic
    }
}

function setupEventListeners() {
    document.getElementById("storeButton").addEventListener("click", function () {
        let value = document.getElementById("valueToStore").value;
        storeData(value).then(() => {
            console.log("Data stored successfully");
        }).catch(err => {
            console.log("Error storing data", err);
        });
    });

    document.getElementById("retrieveButton").addEventListener("click", function () {
        retrieveData().then(value => {
            console.log("Retrieved value:", value);
            document.getElementById("retrievedValue").innerText = `Retrieved Value: ${value}`;
        }).catch(err => {
            console.log("Error retrieving data", err);
        });
    });
}

setup().then(() => {
    console.log('Web3 setup complete.');
    setupEventListeners();
}).catch(err => console.error('Web3 setup failed:', err));