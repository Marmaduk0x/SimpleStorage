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
    const accounts = await web3.eth.getAccounts();
    account = accounts[0];
}

async function estimateGas(tx, account) {
    return tx.estimateGas({from: account});
}

async function getGasPrice() {
    return web3.eth.getGasPrice();
}

async function getNonce(account) {
    return web3.eth.getTransactionCount(account);
}

async function signTransaction(txObject, privateKey) {
    return web3.eth.accounts.signTransaction(txObject, privateKey);
}

async function sendSignedTransaction(signedTx) {
    return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
}

async function storeData(value) {
    const tx = SimpleStorageContract.methods.store(value);
    const gas = await estimateGas(tx, account);
    const gasPrice = await getGasPrice();
    const data = tx.encodeABI();
    const nonce = await getNonce(account);

    const txObject = {
        to: contractAddress,
        data,
        gas,
        gasPrice,
        nonce,
        chainId: 3 // Make sure to replace '3' with the actual chainId of your network
    };

    const signedTx = await signTransaction(txObject, privateKey);

    sendSignedTransaction(signedTx)
        .then(receipt => console.log('Transaction receipt', receipt))
        .catch(err => console.error('Error sending transaction', err));
}

async function retrieveData() {
    return SimpleStorageContract.methods.retrieve().call();
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