import Web3 from 'web3'
import abi_cl from './abi_cl'
import abi_escrow from './abi_escrow'

let web3 = new Web3(new Web3.providers.HttpProvider(process.env.NODE_HOST));

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

let project_statuses = {
    //constants
    STATUS_CREATED: 0,
    STATUS_ACTIVE: 1,
    STATUS_COMPLETED: 2,
    STATUS_CANCELED: 3
};

conf.step_statuses = step_statuses;
conf.project_statuses = project_statuses;

//contract
conf.cl_contract_address = process.env.CONTRACT_ADDRESS_CL;
conf.escrow_contract_address = process.env.CONTRACT_ADDRESS_ESCROW;
conf.chainId = '0x0' + process.env.chainId;

let contract_cl = web3.eth.contract(abi_cl).at(conf.cl_contract_address);
let contract_escrow = web3.eth.contract(abi_escrow).at(conf.escrow_contract_address);

conf.web3 = web3;
conf.contract_cl = contract_cl;
conf.contract_escrow = contract_escrow;

export default conf;