<script>

  import api from '../../api/api'
  import Headerblock from '../partials/Header.vue'
  import Sidebar from './partials/Sidebar.vue'
  import Config from '../../config/index'
  import Tx from 'ethereumjs-tx'
  import keythereum from 'keythereum'

  export default {
    data: function () {
      return {
        account: [],
        balance: 0,
        current_role: null,
      }
    },
    methods: {

    },
    created () {
      let vm = this;
      vm.account = vm.$store.getters.accountData;
      vm.current_role = vm.$helpers.getCurrentRole(vm.account);
    },
    beforeCreate () {
      let vm = this;
      vm.account = vm.$store.getters.accountData;
      vm.current_role = vm.$helpers.getCurrentRole(vm.account);

      Config.web3.eth.getBalance(vm.account.acc_crypt_address)
          .then(balance => {
            vm.balance = Config.web3.utils.fromWei(balance, "ether");
          });

//      let private_key = '89eeaf0b3060c01acdb86b8379d1eb8ca111b3f666a37b1ea7683b2ad016c565';
//
//      Config.web3.eth.getTransactionCount('0x19f99076d5fafc9b55cd594498ac688e2b1e24b9')
//        .then(txCount => {
//
//          let from = '0x19f99076d5fafc9b55cd594498ac688e2b1e24b9';
//
//          let tx = new Tx({
//            nonce: txCount,
//            gasPrice: Config.web3.utils.toHex(21000),
//            gasLimit: Config.web3.utils.toHex(121000),
//            value: Config.web3.utils.toHex(0),
//            from,
//            data: Config.contract.methods
//                .setAddresses(1, '0x1b256c5c8e7ccb14ebb872a6565a70f4f613f010', '0x3cdc6716ffdc8a784a309256351d33fb844a0e34').encodeABI(),
//          });
//
//          let pk = new Buffer(private_key, 'hex');
//          tx.sign(pk);
//
//          return Config.web3.eth.sendSignedTransaction('0x' + tx.serialize().toString('hex'));
//        })
//        .then(resp => {
//          console.log(resp);
//          Config.contract.methods.addresses(1 ,0).call({from: '0x19f99076d5fafc9b55cd594498ac688e2b1e24b9'}, function(error, result) {
//            if (error) {
//              console.error(error);
//            }
//            console.log(result);
//          });
//        })
//
//      Config.contract.methods
//          .setAddresses(1, '0x1b256c5c8e7ccb14ebb872a6565a70f4f613f010', '0x3cdc6716ffdc8a784a309256351d33fb844a0e34')
//          .send({from: '0x19f99076d5fafc9b55cd594498ac688e2b1e24b9'}, function(error, result) {
//            if (error) {
//              console.error(error);
//            }
//            console.log(result);
//            console.log(Config.contract.methods.addresses(1, 0));
//      });

    },
    mounted () {
      this.$helpers.externalPluginsExecute();
    },
    components: {
      Headerblock,
      Sidebar,
    }
  }
</script>

<template>
  <div>
    <headerblock fullwidth="true"></headerblock>

    <main id="main">
      <sidebar :role="current_role"></sidebar>
      <section id="main__content">
        <div class="main__container">
          <header class="main__title">
            <h2>Balance</h2>
          </header>
          <div class="list-group list-group--block">
            <div class="list-group-item media">
              <div class="row">
                <div class="col-md-6">
                  <div class="balance-block">
                    <h2>Address</h2>
                    <h4>Your address is <span>{{account.acc_crypt_address}}</span></h4>
                  </div>
                  <div class="balance-block">
                    <h2>Balance</h2>
                    <h4>Your balance is <span>{{balance}} CL</span></h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  </div>
</template>

<style scoped>
  .list-group--block {
    box-shadow: none;
    margin-bottom: 30px;
  }

  .list-group--block .list-group-item {
    border: 2px solid #e0e0e0;
    padding: 35px 60px;
    overflow-x: auto;
  }

  .balance-block h2 {
    color: #494949;
  }

  .balance-block h4 {
    color: #494949;
    margin-top: 20px;
  }

  .list-group--block .list-group-item button {
    padding: 12px 35px;
    font-size: 18px;
    border: 0;
    margin-top: 26px;
    color: #fff;
    background-color: #01bf86;
  }

  .list-group--block .list-group-item button:hover, .list-group--block .list-group-item button:active, .list-group--block .list-group-item button:visited, .list-group--block .list-group-item button:focus {
    color: #fff;
    background-color: #039368;
  }

  .list-group--block .list-group-item .balance-btn {
    float: right;
  }


  .balance-button {
    float: right;
  }

  .balance-button button {
    margin-left: 10px;
  }


  .balance-details {
    position: relative;
    margin-bottom: 25px;
  }

  .balance-details:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 1px;
    background-color: #e0e0e0;
    bottom: 0;
    left: 0;
  }

  .balance-details h2 {
    margin-bottom: 35px;
  }

  .balance-details h4 {
    margin-bottom: 15px;
  }

  .balance-details p {
    font-size: 14px;
    padding-bottom: 25px;
  }

  .payment-items:last-child .balance-details:after {
    display: none;
  }

  #modal-form .modal-header {
    padding: 20px;
  }
  #modal-form .img-wrap {
    text-align: center;
  }

  .modal-close {
    background-color: transparent;
    border: none;
    float: right;
  }

  .modal-close span {
    font-size: 18px;
  }
</style>