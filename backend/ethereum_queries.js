const Web3 = require('web3');
const async = require('async')
const { abi } = require('./abi');
require('dotenv').config();

const rpcURL = process.env.INFURA_URL;
const web3 = new Web3(rpcURL);

let userContracts = new Set();
userContracts.add('0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5')
userContracts.add('0xdac17f958d2ee523a2206206994597c13d831ec7')


// Controllers for routes 
const ethereum_get = async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');    
    let userAddress = req.params.id;    
    let balances = await readUserBalances(userAddress);    
    res.json(balances)
}

const ethereum_post = async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    let newContract = req.body.contract;
    addContract(newContract);
    let userAddress = req.body.id;    
    let balances = await readUserBalances(userAddress);
    res.json(balances);
}

// Helper functions for route controllers
const readUserBalances = async (address) => {            
    userBalances = []
    let eth_balance = await web3.eth.getBalance(address);
    userBalances.push({'symbol': 'ETH', 'balance': web3.utils.fromWei(eth_balance, 'ether'), 'name': 'Ethereum' })
    for (let c of userContracts) {        
        let contract = new web3.eth.Contract(abi, c);        
        let balance = await getBalanceOf(address, contract)
        let symbol = await getSymbolOf(contract);
        let name = await getNameOf(contract);
        let decimals = await getDecimalsOf(contract)
        userBalances.push({ 'symbol': symbol, 'balance': balance / Math.pow(10,decimals), 'name': name})         
    }
    return userBalances;
}

const addContract = (contract) => {
    userContracts.add(contract);
}

const getBalanceOf = async (address, contract) => {
    let balance = await contract.methods.balanceOf(address).call();
    return balance
}

const getNameOf = async (contract) => {
    let name = await contract.methods.name().call();
    return name;
}

const getSymbolOf = async (contract) => {
    let symbol = await contract.methods.symbol().call();
    return symbol;
}

const getDecimalsOf = async(contract) => {
    let decimals = await contract.methods.decimals().call();
    return decimals;
}

module.exports = {
    ethereum_get,
    ethereum_post
}