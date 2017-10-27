<script>
  export default {
    props: ['fullwidth'],
    data: function () {
      let vm = this;
      let account = vm.$store.state.session.account;
      return {
        account: account
      }
    }
  }
</script>

<template>
  <header id="header" v-bind:class="{affix: fullwidth}">
    <div class="header__top">
      <div v-bind:class="{ container: !fullwidth }">
        <router-link class="logo" to="/">
          <img src="/assets/img/logo.svg" alt="">
          <span class="logo__text">Coinlancer.io</span>
        </router-link>

        <div v-if="account && account.acc_id" class="top-menu-right">
          <ul class="navigation">
            <li>
              <router-link to="/projects">Projects</router-link>
            </li>
          </ul>

          <ul class="header-alt__menu">
           <li class="dropdown">
              <a href="#" data-toggle="dropdown"><i class="zmdi zmdi-notifications"></i></a>

              <div class="dropdown-menu dropdown-menu--lg pull-right">
                <div class="list-group__header">
                  NOTIFICATIONS
                </div>
                <div class="list-group">
                  <a class="list-group-item media" href="#">
                    <div class="pull-right">
                      <img class="list-group__img img-circle" width="40" height="40"
                           src="/assets/img/demo/people/1.jpg" alt="">
                    </div>
                    <div class="media-body list-group__text">
                      <strong>David Belle</strong>
                      <small>Lorem ipsum dolor sit amet, consectetur adipisicing</small>
                    </div>
                  </a>
                  <a class="list-group-item media" href="#">
                    <div class="pull-right">
                      <img class="list-group__img img-circle" width="40" height="40"
                           src="/assets/img/demo/people/3.jpg" alt="">
                    </div>
                    <div class="media-body list-group__text">
                      <strong class="lgi-heading">Jonathan Morris</strong>
                      <small class="lgi-text">Lorem ipsum dolor sit amet, consectetur adipisicing.
                      </small>
                    </div>
                  </a>
                  <a class="list-group-item" href="#">
                    <div class="list-group__text">
                      <strong>Fredric Mitchell Jr.</strong>
                      <small class="lgi-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. A,
                        harum.
                      </small>
                    </div>
                  </a>
                  <a class="list-group-item" href="#">
                    <div class="list-group__text">
                      <strong>Glenn Jecobs</strong>
                      <small class="lgi-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                        Adipisci ea nobis quaerat quod sint voluptas.
                      </small>
                    </div>
                  </a>
                  <a class="list-group-item media" href="#">
                    <div class="pull-right">
                      <img class="list-group__img img-circle" width="40" height="40"
                           src="/assets/img/demo/people/6.jpg" alt="">
                    </div>
                    <div class="media-body list-group__text">
                      <strong>Bill Phillips</strong>
                      <small class="lgi-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                        Alias corporis esse incidunt ipsum molestias vel.
                      </small>
                    </div>
                  </a>
                  <a href="#" class="view-more">View all</a>
                </div>
              </div>
            </li>
            <li>
              <a href="#"><i class="zmdi zmdi-email"></i></a>
            </li>
            <li class="header-alt__profile dropdown">
              <a href="#" data-toggle="dropdown">
                <img src="/assets/img/demo/people/2.jpg" alt="">
              </a>

              <ul class="dropdown-menu pull-right">
                <li><router-link to="/dashboard/settings">Dashboard</router-link></li>
                <li><a href="javascript:void(null)" onclick="window.location.href = '/'">Logout</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>