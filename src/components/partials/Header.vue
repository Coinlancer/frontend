<script>
  export default {
  }
</script>

<template>
  <header id="header">
    <div class="header__top">
      <div class="container">
        <ul class="header-alt__menu">
          <li>
            <a href="" data-rmd-action="block-open" data-rmd-target=".header-alt__search-wrap"
               data-rmd-backdrop-class="backdrop--search">
              <i class="zmdi zmdi-search"></i>
            </a>
          </li>
          <li class="dropdown">
            <a href="" data-toggle="dropdown"><i class="zmdi zmdi-notifications"></i></a>

            <div class="dropdown-menu dropdown-menu--lg pull-right">
              <div class="list-group__header">
                NOTIFICATIONS
              </div>
              <div class="list-group">
                <a class="list-group-item media" href="">
                  <div class="pull-right">
                    <img class="list-group__img img-circle" width="40" height="40"
                         src="/assetsimg/demo/people/1.jpg" alt="">
                  </div>
                  <div class="media-body list-group__text">
                    <strong>David Belle</strong>
                    <small>Lorem ipsum dolor sit amet, consectetur adipisicing</small>
                  </div>
                </a>
                <a class="list-group-item media" href="">
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
                <a class="list-group-item" href="">
                  <div class="list-group__text">
                    <strong>Fredric Mitchell Jr.</strong>
                    <small class="lgi-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. A,
                      harum.
                    </small>
                  </div>
                </a>
                <a class="list-group-item" href="">
                  <div class="list-group__text">
                    <strong>Glenn Jecobs</strong>
                    <small class="lgi-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Adipisci ea nobis quaerat quod sint voluptas.
                    </small>
                  </div>
                </a>
                <a class="list-group-item media" href="">
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
                <a href="" class="view-more">View all</a>
              </div>
            </div>
          </li>
          <li class="dropdown">
            <a href="" data-toggle="dropdown"><i class="zmdi zmdi-email"></i></a>

            <div class="dropdown-menu dropdown-menu--lg pull-right">
              <div class="list-group">
                <div class="list-group__header">
                  MESSAGES
                </div>
                <a class="list-group-item media" href="">
                  <div class="pull-left">
                    <img class="list-group__img img-circle" width="40" height="40"
                         src="/assets/img/demo/people/1.jpg" alt="">
                  </div>
                  <div class="media-body list-group__text">
                    <strong>David Belle</strong>
                    <small>Lorem ipsum dolor sit amet, consectetur adipisicing.</small>
                  </div>
                </a>
                <a class="list-group-item media" href="">
                  <div class="pull-left">
                    <img class="list-group__img img-circle" width="40" height="40"
                         src="/assets/img/demo/people/3.jpg" alt="">
                  </div>
                  <div class="media-body list-group__text">
                    <strong>Jonathan Morris</strong>
                    <small>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti molestias
                      neque quos rem vel voluptatum?
                    </small>
                  </div>
                </a>
                <a class="list-group-item media" href="">
                  <div class="pull-left">
                    <img class="list-group__img img-circle" width="40" height="40"
                         src="/assets/img/demo/people/4.jpg" alt="">
                  </div>
                  <div class="media-body list-group__text">
                    <strong>Fredric Mitchell Jr.</strong>
                    <small>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias laborum
                      libero nam perferendis ratione temporibus.
                    </small>
                  </div>
                </a>
                <a class="list-group-item media" href="">
                  <div class="pull-left">
                    <img class="list-group__img img-circle" width="40" height="40"
                         src="/assets/img/demo/people/5.jpg" alt="">
                  </div>
                  <div class="media-body list-group__text">
                    <strong>Glenn Jecobs</strong>
                    <small>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam illum in
                      libero, modi nobis perferendis.
                    </small>
                  </div>
                </a>
                <a class="list-group-item media" href="">
                  <div class="pull-left">
                    <img class="list-group__img img-circle" width="40" height="40"
                         src="/assets/img/demo/people/6.jpg" alt="">
                  </div>
                  <div class="media-body list-group__text">
                    <strong>Bill Phillips</strong>
                    <small>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Placeat rem
                      repudiandae sapiente sit tenetur voluptatem?
                    </small>
                  </div>
                </a>

                <a class="view-more" href="">View all</a>
              </div>
            </div>
          </li>
          <li class="hidden-xs">
            <a href="index.html"><i class="zmdi zmdi-home"></i></a>
          </li>
          <li class="header-alt__profile dropdown">
            <a href="" data-toggle="dropdown">
              <img src="/assets/img/demo/people/2.jpg" alt="">
            </a>

            <ul class="dropdown-menu pull-right">
              <li><router-link to="/dashboard/projects/">Dashboard</router-link></li>
              <li><a href="javascript:void(null)" onclick="window.location.href = '/'">Logout</a></li>
            </ul>
          </li>
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

        <div class="navigation-trigger visible-xs visible-sm" data-rmd-action="block-open"
             data-rmd-target=".navigation">
          <i class="zmdi zmdi-menu"></i>
        </div>

        <ul class="navigation">
          <li class="visible-xs visible-sm"><a class="navigation__close" data-rmd-action="navigation-close"
                                               href=""><i class="zmdi zmdi-long-arrow-right"></i></a></li>

          <li class="navigation__dropdown">
            <router-link to="/projects/" class="media">Projects</router-link>
          </li>

          <li class="navigation__dropdown">
            <a href="" class="prevent-default">Profile</a>
          </li>

          <li><a href="dashboard/client-balance.html">Home</a></li>

        </ul>
      </div>
    </div>
  </header>
</template>