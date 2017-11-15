<script>

  import Api from '../../api/api'

  export default {
    props: ['response', 'is_owner', 'is_executor'],
    data: function () {
      let vm = this;

      let account = vm.$store.getters.accountData;
      let current_role = vm.$helpers.getCurrentRole(account);

      return {
        account: account,
        current_role: current_role,
        hired_suggestion: vm.response.hired_suggestion,
        steps: vm.response.steps
      }
    },
    methods: {
      deleteStep: function (step_id, event) {
        let vm = this;
        let dialog_context = null;
        if (event) event.preventDefault();

        if (!step_id) {
          return false;
        }

        vm.$dialog.confirm("Confirm step deleting")
            .then((dialog) => {
              dialog_context = dialog;
              return Api.deleteStep(vm.$route.params.id, step_id);
            })
            .then(() => {
              return Api.getProjectSteps(vm.$route.params.id);
            })
            .then((resp) => {
              vm.steps = resp.data;
              return vm.$helpers.successMsg('Step deleted');
            })
            .catch(vm.$errors.handle)
            .then(() => {
              dialog_context.close();
            });
      },

      completeStep: function (step_id, event) {
        let vm = this;
        let dialog_context = null;
        if (event) event.preventDefault();

        if (!step_id) {
          return false;
        }

        vm.$dialog.confirm("Confirm step completing")
            .then((dialog) => {
              dialog_context = dialog;
              return Api.completeStep(step_id);
            })
            .then(() => {
              return Api.getProjectSteps(vm.$route.params.id);
            })
            .then((resp) => {
              vm.steps = resp.data;
              return vm.$helpers.successMsg('Step mark as completed');
            })
            .catch((err) => {
              if (!err) {
                return;
              }
              vm.$errors.handle(err);
            })
            .then(() => {
              dialog_context.close();
            });
      },

      depositStep: function (step, event) {
        let vm = this;
        let dialog_context = null;
        if (event) event.preventDefault();

        let step_id = step.stp_id;

        if (!step_id) {
          return false;
        }

        let allowance = vm.$config.web3.fromWei(vm.$config.contract_cl.allowance(vm.account.acc_crypt_address, vm.$config.escrow_contract_address).toNumber());
        let current_fee = vm.$config.contract_escrow.getFee().toNumber();

        if (!current_fee) {
          return vm.$helpers.errorMsg('Can not get fee value from escrow contract. Contact support.');
        }

        if (current_fee <= 0 || current_fee > 100) {
          return vm.$helpers.errorMsg('Invalid fee size. Contact support.');
        }

        let budget_with_commission = parseFloat(step.stp_budget) * (1 + (current_fee / 100));

        if (parseFloat(allowance) < budget_with_commission) {
            return vm.$helpers.errorMsg('Not enough allowance for deposit step');
        }

        vm.$dialog.confirm("Confirm step completing. It will take some gas from your ETH balance.")
            .then((dialog) => {
              dialog_context = dialog;

              return Api.depositStep(step_id);
            })
            .then(() => {
              return Api.getProjectSteps(vm.$route.params.id);
            })
            .then((resp) => {
              vm.steps = resp.data;
              return vm.$helpers.successMsg('Step deposited');
            })
            .catch((err) => {
              if (!err) {
                //dialog cancel
                return;
              }
              vm.$errors.handle(err);
            })
            .then(() => {
              dialog_context.close();
            });
      },

      markAsDoneStep: function (step_id, event) {
        let vm = this;
        let dialog_context = null;
        if (event) event.preventDefault();

        if (!step_id) {
          return false;
        }

        vm.$dialog.confirm("Confirm step completing")
            .then((dialog) => {
              dialog_context = dialog;
              return Api.markAsDoneStep(step_id);
            })
            .then(() => {
              return Api.getProjectSteps(vm.$route.params.id);
            })
            .then((resp) => {
              vm.steps = resp.data;
              return vm.$helpers.successMsg('Step mark as done');
            })
            .catch((err) => {
              if (!err) {
                return;
              }
              vm.$errors.handle(err);
            })
            .then(() => {
              dialog_context.close();
            });
      },

      refundStep: function () {
        let vm = this;
        let dialog_context = null;

        vm.$dialog.confirm("Confirm refund process. It will cancel project and refund all uncompleted operations.")
            .then((dialog) => {
              dialog_context = dialog;

              return Api.cancelProject(vm.$route.params.id);
            })
            .then(() => {
              return Api.getProjectSteps(vm.$route.params.id);
            })
            .then((resp) => {
              vm.steps = resp.data;
              return vm.$helpers.successMsg('Project canceled');
            })
            .catch((err) => {
              if (!err) {
                return;
              }
              vm.$errors.handle(err);
            })
            .then(() => {
              dialog_context.close();
            });
      },
    },
  }
</script>

<template>
  <div v-if="steps && steps.length" class="card__sub">
    <h4>Steps of project</h4>
    <div class="card-steps">
      <ul>
        <li v-for="(step, index) in steps">
          <div class="list-group list-group--block tasks-lists">
            <div v-if="step.stp_status == $config.step_statuses.STATUS_WAIT_DEPOSIT_CONFIRMATION" class="checked-icon">
              <img title="Wait for transaction confirmations" src="/assets/img/icons/wait_for_confirmation.gif" alt="">
            </div>
            <div v-if="step.stp_status == $config.step_statuses.STATUS_DEPOSITED" class="checked-icon">
              <img title="Your deposit successful confirmed" src="/assets/img/icons/deposit.png" alt="">
            </div>
            <div v-if="step.stp_status == $config.step_statuses.STATUS_MARK_AS_DONE" class="checked-icon">
              <img title="Wait for complete from you" src="/assets/img/icons/mark_as_done.png" alt="">
            </div>
            <div v-else-if="step.stp_status == $config.step_statuses.STATUS_COMPLETED" class="checked-icon">
              <img title="Step completed" src="/assets/img/icons/complete.png" alt="">
            </div>
            <div v-else-if="step.stp_status == $config.step_statuses.STATUS_REFUNDED" class="checked-icon">
              <img title="Step completed" src="/assets/img/icons/refund.png" alt="">
            </div>
            <div class="list-group-item">
              <div class="checkbox checkbox--char">
                <label>
                  <input type="checkbox">
                  <span class="checkbox__helper"></span>
                  <span class="tasks-list__info">
                                    {{step.stp_title}}
                                    <span class="price-project">{{step.stp_budget}} CL</span>
                                </span>
                </label>
              </div>

              <div v-if="is_owner" class="actions list-group__actions">
                <div class="dropdown">
                  <a href="#" data-toggle="dropdown"><i
                      class="zmdi zmdi-more-vert"></i></a>

                  <ul class="dropdown-menu pull-right">
                    <li v-bind:class="{disabledLi: !(index == 0 || steps[index - 1].stp_status == $config.step_statuses.STATUS_COMPLETED) || !hired_suggestion || step.stp_status != $config.step_statuses.STATUS_CREATED}"><a href="#" @click="depositStep(step, $event)">Deposit</a></li>
                    <li v-bind:class="{disabledLi: step.stp_status != $config.step_statuses.STATUS_MARK_AS_DONE}"><a href="#" @click="completeStep(step.stp_id, $event)">Complete</a></li>
                    <li v-bind:class="{disabledLi: hired_suggestion || step.stp_status != $config.step_statuses.STATUS_CREATED}"><a href="#" @click="deleteStep(step.stp_id, $event)">Delete</a></li>
                    <li v-bind:class="{disabledLi: step.stp_status != $config.step_statuses.STATUS_DEPOSITED && step.stp_status != $config.step_statuses.STATUS_MARK_AS_DONE}"><a href="#" @click="refundStep">Refund</a></li>
                  </ul>
                </div>
              </div>

              <div v-if="is_executor" class="actions list-group__actions">
                <div class="dropdown">
                  <a href="#" data-toggle="dropdown"><i
                      class="zmdi zmdi-more-vert"></i></a>

                  <ul class="dropdown-menu pull-right">
                    <li v-bind:class="{disabledLi: step.stp_status != $config.step_statuses.STATUS_DEPOSITED}"><a href="#" @click="markAsDoneStep(step.stp_id, $event)">Mark as done</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
  .disabledLi {
    pointer-events:none;
    opacity:0.6;
  }
</style>