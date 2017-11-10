import Web3 from 'web3'
import abi from './abi'

let web3 = new Web3(new Web3.providers.HttpProvider('http://5.189.189.240:8545'));

var conf = {
    request_ttl: 30000,
    api_host: process.env.API_HOST,
    home_page: process.env.HOME_PAGE_HOST,
    MAX_FILE_SIZE_IN_BYTES: 10 * 1024 * 1024, //10MB
    limits: {
        projects: 8,
        freelancers: 8,
        suggestions: 4,
        dashboard_projects: 8,
        dashboard_suggestions: 8,
        dashboard_works: 8
    }
};

let step_statuses = {
    //constants
    STATUS_CREATED: 0,
    STATUS_WAIT_DEPOSIT_CONFIRMATION: 1,
    STATUS_DEPOSITED: 2,
    STATUS_MARK_AS_DONE: 3,
    STATUS_COMPLETED: 4,
    STATUS_REFUNDED: 5
};

conf.step_statuses = step_statuses;

//contract
conf.cl_contract_address = process.env.CONTRACT_ADDRESS_CL;
conf.escrow_contract_address = process.env.CONTRACT_ADDRESS_ESCROW;
conf.chainId = '0x0' + process.env.chainId;

let contract = web3.eth.contract(abi).at(conf.cl_contract_address);

conf.web3 = web3;
conf.contract = contract;

export default conf;