<template>
    <button
            :class="{'vue-btn-loader-error': !isSuccess && !emptyStatus, 'vue-btn-loader-success': isSuccess, 'is-loading': isLoading}">

        <transition name="fade" mode="out-in">
            <div :class="{ 'spinner': loading, 'check': !emptyStatus && isSuccess && !loading, 'cross': !emptyStatus && !isSuccess && !loading }"></div>
        </transition>

        <slot v-if="!isLoading && showSlot"></slot>
    </button>
</template>

<script>
  export default {
    name: 'vue-button-spinner',
    props: {
      isLoading: {
        type: Boolean,
        default: false
      },
      status: {
        type: String | Boolean,
        default: ''
      }
    },
    computed: {
      loading () {
        return this.isLoading
      },
      isSuccess () {
        return this.status === 'success' || this.status === true
      },
      emptyStatus () {
        return !this.status.length
      },
      showSlot () {
        return this.isSuccess || this.loading || this.emptyStatus
      }
    }
  }

</script>

<style lang="css" scoped>

    .fade-enter-active, .fade-leave-active {
        transition: opacity 1s;
    }

    .fade-enter, .fade-leave-active {
        opacity: 0;
        will-change: opacity;
    }

    @keyframes rotation {
        from {
            transform: rotate(0deg)
        }

        to {
            transform: rotate(359deg)
        }
    }

    button.vue-btn-loader-error:not(.is-loading) {
        background-color: #F44336;
    }

    button.vue-btn-loader-success:not(.is-loading) {
        background-color: #8BC34A;
        color: #fff;
    }

    button.vue-btn:disabled {
        cursor: not-allowed;
    }

    /**
        Spinner Icon
    **/

    .spinner {
        height: 10px;
        width: 10px;
        margin-right: 8px;
        opacity: 1;
        filter: alpha(opacity=100);
        animation: rotation .7s infinite linear;
        border: 4px solid rgba(0, 0, 0, 0.2);
        border-top-color: #9E9E9E;
        border-radius: 100%;
        transition: .3s all ease;
    }

    /**
        Check Icon
    **/

    .check {
        display: inline-block;
        width: 28px;
        height: 17px;
        border-radius: 50%;
        transform: rotate(45deg);
        color: white;
        will-change: transform;
    }

    .check:before {
        content: "";
        position: absolute;
        width: 3px;
        height: 9px;
        background-color: #fff;
        left: 11px;
        top: 6px;
    }

    .check:after {
        content: "";
        position: absolute;
        width: 3px;
        height: 3px;
        background-color: #fff;
        left: 8px;
        top: 12px;
    }

    /**
        Cross Icon
    **/

    .cross {
        display: inline-block;
        width: 17px;
        height: 16px;
        position: relative;
    }

    .cross:before, .cross:after {
        position: absolute;
        left: 8px;
        content: ' ';
        height: 16px;
        width: 2px;
        background-color: #fff;
    }

    .cross:before {
        transform: rotate(45deg);
        will-change: transform;
    }

    .cross:after {
        transform: rotate(-45deg);
        will-change: transform;

    }
</style>