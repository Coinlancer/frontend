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

  <header v-if="fullwidth" id="header-alt">
    <a href="#" class="header-alt__trigger hidden-lg" data-rmd-action="block-open" data-rmd-target="#main__sidebar">
      <i class="zmdi zmdi-menu"></i>
    </a>

    <router-link to="/dashboard/finances" class="header-alt__logo hidden-xs">Coinlancer Dashboard</router-link>

    <ul v-if="account && account.acc_id && account.acc_is_verified" class="header-alt__menu">
      <li>
        <router-link to="/projects"><i class="zmdi zmdi-home"></i></router-link>
      </li>
      <li class="header-alt__profile dropdown">
        <a href="" data-toggle="dropdown">
          <img v-if="account.acc_avatar" :src="$config.api_host + '/' + account.acc_avatar" alt=""/>
          <img v-else src="/assets/img/icons/avatar.png" alt=""/>
        </a>

        <ul class="dropdown-menu pull-right">
          <li><router-link to="/dashboard/finances">Dashboard</router-link></li>
          <li><router-link to="/logout">Logout</router-link></li>
        </ul>
      </li>
    </ul>
  </header>

  <header v-else id="header" class="affix-top">
      <div v-if="account && account.acc_id && account.acc_is_verified" class="header__top">
        <div class="container">
          <ul class="header-alt__menu">
            <li>
              <router-link to="/projects"><i class="zmdi zmdi-home"></i></router-link>
            </li>
            <li class="header-alt__profile dropdown">
              <a href="" data-toggle="dropdown">
                <img v-if="account.acc_avatar" :src="$config.api_host + '/' + account.acc_avatar" alt=""/>
                <img v-else src="/assets/img/icons/avatar.png" alt=""/>
              </a>

              <ul class="dropdown-menu pull-right">
                <li><router-link to="/dashboard/finances">Dashboard</router-link></li>
                <li><router-link to="/logout">Logout</router-link></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>

      <div v-else class="header__top">
        <div class="container">
          <ul class="top-nav">

            <li class="op-nav__guest">
              <router-link to="/register">Register</router-link>
            </li>

            <li class="op-nav__guest">
              <router-link to="/login">Login</router-link>
            </li>

            <!--<li class="pull-right hidden-xs"><span><i class="zmdi zmdi-email"></i>hello@gmail.com</span></li>-->
            <!--<li class="pull-right hidden-xs"><span><i class="zmdi zmdi-phone"></i>001-541-754-3010</span></li>-->
          </ul>
        </div>
      </div>
    </div>

    <div class="header__main">
      <div class="container">
        <a class="logo" :href="$config.homepage">
          <img src="/assets/img/logo2.png" alt="">
          <div class="logo__text">
            <span>Coinlancer</span>
            <span>Freelance exchange</span>
          </div>
        </a>

        <div class="navigation-trigger visible-xs visible-sm" data-rmd-action="block-open" data-rmd-target=".navigation">
          <i class="zmdi zmdi-menu"></i>
        </div>

        <ul class="navigation">
          <li class="visible-xs visible-sm"><a class="navigation__close" data-rmd-action="navigation-close" href=""><i class="zmdi zmdi-long-arrow-right"></i></a></li>

          <li class="navigation__dropdown">
            <router-link to="/projects">Projects</router-link>
          </li>

          <li class="navigation__dropdown">
            <router-link class="prevent-default" to="/freelancers">Freelancers</router-link>
          </li>

        </ul>
      </div>
    </div>
  </header>
</template>