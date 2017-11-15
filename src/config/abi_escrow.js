module.exports = [{
    "constant": false,
    "inputs": [{"name": "step_id", "type": "uint256"}],
    "name": "refund",
    "outputs": [],
    "payable": false,
    "type": "function",
    "stateMutability": "nonpayable"
}, {
    "constant": false,
    "inputs": [{"name": "new_account", "type": "address"}],
    "name": "setFeeAccount",
    "outputs": [],
    "payable": false,
    "type": "function",
    "stateMutability": "nonpayable"
}, {
    "constant": true,
    "inputs": [],
    "name": "founder",
    "outputs": [{"name": "", "type": "address"}],
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
    "constant": false,
    "inputs": [{"name": "fee", "type": "uint256"}],
    "name": "setFee",
    "outputs": [],
    "payable": false,
    "type": "function",
    "stateMutability": "nonpayable"
}, {
    "constant": true,
    "inputs": [{"name": "", "type": "uint256"}],
    "name": "steps",
    "outputs": [{"name": "from", "type": "address"}, {"name": "to", "type": "address"}, {
        "name": "amount",
        "type": "uint256"
    }],
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
    "inputs": [{"name": "step_id", "type": "uint256"}],
    "name": "pay",
    "outputs": [],
    "payable": false,
    "type": "function",
    "stateMutability": "nonpayable"
}, {
    "constant": true,
    "inputs": [],
    "name": "getFee",
    "outputs": [{"name": "fee", "type": "uint256"}],
    "payable": false,
    "type": "function",
    "stateMutability": "view"
}, {
    "constant": false,
    "inputs": [{"name": "step_id", "type": "uint256"}, {"name": "from", "type": "address"}, {
        "name": "to",
        "type": "address"
    }, {"name": "amount", "type": "uint256"}],
    "name": "deposit",
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
    "inputs": [{"name": "token_address", "type": "address"}],
    "payable": false,
    "type": "constructor",
    "stateMutability": "nonpayable"
}];