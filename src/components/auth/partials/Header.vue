<script>
  export default {
  }
</script>

<template>
  <header id="header">
    <div class="header__top">
      <div class="container">
        <ul class="top-nav">
          <li class="dropdown top-nav__guest">
            <router-link to="/register" class="media">Register</router-link>
          </li>

          <li class="dropdown top-nav__guest">
            <router-link to="/login" class="media">Login</router-link>
          </li>

          <li class="pull-right top-nav__icon">
            <a href=""><i class="zmdi zmdi-facebook"></i></a>
          </li>
          <li class="pull-right top-nav__icon">
            <a href=""><i class="zmdi zmdi-twitter"></i></a>
          </li>
          <li class="pull-right top-nav__icon">
            <a href=""><i class="zmdi zmdi-google"></i></a>
          </li>

          <li class="pull-right hidden-xs"><span><i class="zmdi zmdi-email"></i>hello@gmail.com</span></li>
          <li class="pull-right hidden-xs"><span><i class="zmdi zmdi-phone"></i>001-541-754-3010</span></li>
        </ul>
      </div>
    </div>

    <div class="header__main">
      <div class="container">
        <a class="logo" href="index.html">
          <img src="/assets/img/logo2.png" alt="">
          <div class="logo__text">
            <span>Coinlancer</span>
            <span>Freelance exchange</span>
          </div>
        </a>
      </div>
    </div>
  </header>
</template>