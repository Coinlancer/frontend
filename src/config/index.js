import Web3 from 'web3'

const sc_abi = [{
    "constant": false,
    "inputs": [{"name": "id", "type": "uint256"}, {"name": "fee", "type": "uint256"}],
    "name": "setComission",
    "outputs": [],
    "payable": false,
    "type": "function",
    "stateMutability": "nonpayable"
}, {
    "constant": false,
    "inputs": [{"name": "id", "type": "uint256"}],
    "name": "refund",
    "outputs": [],
    "payable": false,
    "type": "function",
    "stateMutability": "nonpayable"
}, {
    "constant": false,
    "inputs": [{"name": "id", "type": "uint256"}],
    "name": "stepTransferToEscrow",
    "outputs": [],
    "payable": false,
    "type": "function",
    "stateMutability": "nonpayable"
}, {
    "constant": false,
    "inputs": [{"name": "new_feeAccount", "type": "address"}],
    "name": "setFeeAccount",
    "outputs": [],
    "payable": false,
    "type": "function",
    "stateMutability": "nonpayable"
}, {
    "constant": true,
    "inputs": [{"name": "", "type": "uint256"}],
    "name": "step_payments",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "type": "function",
    "stateMutability": "view"
}, {
    "constant": true,
    "inputs": [],
    "name": "feeAccount",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "type": "function",
    "stateMutability": "view"
}, {
    "constant": true,
    "inputs": [{"name": "", "type": "uint256"}, {"name": "", "type": "uint256"}],
    "name": "addresses",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "type": "function",
    "stateMutability": "view"
}, {
    "constant": true,
    "inputs": [],
    "name": "owner",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "type": "function",
    "stateMutability": "view"
}, {
    "constant": false,
    "inputs": [{"name": "ids", "type": "uint256[]"}],
    "name": "stepTransferToExecutor",
    "outputs": [],
    "payable": false,
    "type": "function",
    "stateMutability": "nonpayable"
}, {
    "constant": true,
    "inputs": [{"name": "", "type": "uint256"}],
    "name": "comissions",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "type": "function",
    "stateMutability": "view"
}, {
    "constant": false,
    "inputs": [{"name": "id", "type": "uint256"}],
    "name": "deleteDeal",
    "outputs": [],
    "payable": false,
    "type": "function",
    "stateMutability": "nonpayable"
}, {
    "constant": false,
    "inputs": [{"name": "id", "type": "uint256"}, {"name": "client", "type": "address"}, {
        "name": "executor",
        "type": "address"
    }],
    "name": "setAddresses",
    "outputs": [],
    "payable": false,
    "type": "function",
    "stateMutability": "nonpayable"
}, {
    "constant": false,
    "inputs": [{"name": "newOwner", "type": "address"}],
    "name": "transferOwnership",
    "outputs": [],
    "payable": false,
    "type": "function",
    "stateMutability": "nonpayable"
}, {
    "constant": true,
    "inputs": [],
    "name": "token",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "type": "function",
    "stateMutability": "view"
}, {
    "constant": false,
    "inputs": [{"name": "id", "type": "uint256"}, {"name": "amount", "type": "uint256"}],
    "name": "setStepPayments",
    "outputs": [],
    "payable": false,
    "type": "function",
    "stateMutability": "nonpayable"
}, {
    "inputs": [{"name": "token_address", "type": "address"}],
    "payable": false,
    "type": "constructor",
    "stateMutability": "nonpayable"
}]

let web3 = new Web3(new Web3.providers.HttpProvider('http://5.189.189.240:8545'));

//contract
let coinContract = {
    address: '0xcbfc33dc45a2f8fce0f27685631f91249c334a57',
    abi: sc_abi,
};

/*
 аккаунты:
 0x19f99076d5fafc9b55cd594498ac688e2b1e24b9 Vehzylbq123 owner
 0x1b256c5c8e7ccb14ebb872a6565a70f4f613f010 Vehzylbq123
 0x3cdc6716ffdc8a784a309256351d33fb844a0e34 Vehzylbq123


 [2:13]
 адрес токена:
 0xfff0417ed6ab04b25e3f05cd1a048e5e7f63e36c


 [2:14]
 адрес ескроу-контракта:
 0xcbfc33dc45a2f8fce0f27685631f91249c334a57
 */

var conf = {
    request_ttl: 30000,
    api_host: 'http://192.168.1.125:8099',//process.env.API_HOST,
    MAX_FILE_SIZE_IN_BYTES: 10 * 1024 * 1024 //10MB
};

let contract = new web3.eth.Contract(coinContract.abi, coinContract.address);

conf.web3 = web3;
conf.contract = contract;

export default conf;