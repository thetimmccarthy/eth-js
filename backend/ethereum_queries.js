const Web3 = require('web3');
const async = require('async')
const { abi } = require('./abi');
require('dotenv').config();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const rpcURL = process.env.INFURA_URL;
const web3 = new Web3(rpcURL);

// TODO: incorporate database to store contracts, should store every contract inputted by each user

// This will eventuall be a database, will have to rewrite functions
let userContracts = new Set();
userContracts.add('0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5')
userContracts.add('0xdac17f958d2ee523a2206206994597c13d831ec7')

const BASE_CURRENCY = 'usd'

// Controllers for routes 
const ethereum_get = async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');    
    let userAddress = req.params.id;    
    // let balances = await readUserBalances(userAddress);    
    // res.json(balances)
    asyncBalances(userAddress, req, res)

}

const ethereum_post = async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    let newContract = req.body.contract;
    addContract(newContract);
    let userAddress = req.body.id;    
    asyncBalances(userAddress, req, res);
}

// Helper functions for route controllers
const readUserBalances = async (address, our_contract, price, cb) => {            
    async.parallel({
        balance: function(callback) {
            getBalanceOf(address, our_contract, callback);
        }, 
        symbol: function(callback) {
            getSymbolOf(our_contract, callback);
        }, 
        name: function(callback) {
            getNameOf(our_contract, callback);
        }, 
        decimals: function(callback) {
            getDecimalsOf(our_contract, callback);
        }, 
        usd_price: function(callback) {
            callback(null, price)
        }
    }, function(err, results) {        
        if(err) {               
            cb(err, null);
        } else {            
            cb(null, results);            
        }
    })

}

const asyncBalances = async (this_address, req, res) => {
    let token_prices = await get_all_prices_usd(userContracts);    
    console.log(token_prices)
    async.map(userContracts, function(contract, cb) {        
        let this_token_price = token_prices[contract][BASE_CURRENCY];            
        let new_contract = new web3.eth.Contract(abi, contract);        
        readUserBalances(this_address, new_contract, this_token_price, cb);
    }, async function(err, results){
        let eth_balance = await web3.eth.getBalance(this_address);
        eth = {'symbol': 'ETH', 'balance': eth_balance, 'decimals': 18, 'name': 'Ethereum', usd_price: token_prices['eth'][BASE_CURRENCY] }
        let x = [...results, eth]
        console.log(x)
        res.json(x)
    })
}

/* ---------------- */

const get_all_prices_usd = async (token_contracts) => {
    token_contracts = Array.from(token_contracts);
    const token_pairs = token_contracts.join(',');    
    const query = `contract_addresses=${token_pairs}&vs_currencies=${BASE_CURRENCY}`;
    const url = `https://api.coingecko.com/api/v3/simple/token_price/ethereum?${query}`;
    const response = await fetch(url);
    
    // dictionary of prices with contract address as key and {currency: price} as value
    const token_prices = await response.json();    
    
    // get ETH price and add to dict
    let eth = await get_eth_price_usd();
    return {...token_prices, eth: eth['ethereum'] }
    
}

const get_eth_price_usd = async () => {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=${BASE_CURRENCY}`;
    const response = await fetch(url);
    
    // dictionary of prices with contract address as key and {currency: price} as value
    const token_prices = await response.json();  
    return token_prices;
    
}

const addContract = (contract) => {
    userContracts.add(contract);
}



const getBalanceOf = (address, contract, cb) => {
    contract.methods.balanceOf(address).call((err, bal) => {
        if (err) {
            cb(err, null);
        } else {            
            cb(null, bal);
        }
    });    
}

const getNameOf = (contract, cb) => {
    contract.methods.name().call((err, name) => {
        if (err) {
            cb(err, null);
        } else {
            cb(null, name);
        }
    });    
}

const getSymbolOf = (contract, cb) => {
    contract.methods.symbol().call((err, symbol) => {        
        if (err) {
            cb(err, null);
        } else {            
            cb(null, symbol);
        }
    })    
}

const getDecimalsOf = (contract, cb) => {
    contract.methods.decimals().call((err, decimal) => {        
        if (err) {            
            cb(err, null);
        } else {
            cb(null, decimal);
        }
    }); 
}

const getEthBalance = async (address, cb) => {
    web3.eth.getBalance(address).then(bal => {        
            let eth_balance = web3.utils.fromWei(bal, 'ether');
            eth_balance = parseFloat(eth_balance);
            return cb(null, eth_balance);            
        })
        .catch(err => {
            return cb(err, null)
        })    
}

module.exports = {
    ethereum_get,
    ethereum_post
}