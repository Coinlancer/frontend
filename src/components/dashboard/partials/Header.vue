<script>
  export default {
  }
</script>

<template>
  <header id="header-alt">
    <a href="" class="header-alt__trigger hidden-lg" data-rmd-action="block-open" data-rmd-target="#main__sidebar">
      <i class="zmdi zmdi-menu"></i>
    </a>

    <a href="index.html" class="header-alt__logo hidden-xs">Coinlancer Dashboard</a>

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
                     src="/assets/img/demo/people/1.jpg" alt="">
              </div>
              <div class="media-body list-group__text">
                <strong>David Belle</strong>
                <small>Cum sociis natoque penatibus et magnis dis parturient montes</small>
              </div>
            </a>
            <a class="list-group-item media" href="">
              <div class="pull-right">
                <img class="list-group__img img-circle" width="40" height="40"
                     src="/assets/img/demo/people/3.jpg" alt="">
              </div>
              <div class="media-body list-group__text">
                <strong class="lgi-heading">Jonathan Morris</strong>
                <small class="lgi-text">Nunc quis diam diamurabitur at dolor elementum, dictum turpis vel
                </small>
              </div>
            </a>
            <a class="list-group-item" href="">
              <div class="list-group__text">
                <strong>Fredric Mitchell Jr.</strong>
                <small class="lgi-text">Phasellus a ante et est ornare accumsan at vel magnauis blandit
                  turpis at augue ultricies
                </small>
              </div>
            </a>
            <a class="list-group-item" href="">
              <div class="list-group__text">
                <strong>Glenn Jecobs</strong>
                <small class="lgi-text">Ut vitae lacus sem ellentesque maximus, nunc sit amet varius
                  dignissim, dui est consectetur neque
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
                <small class="lgi-text">Proin laoreet commodo eros id faucibus. Donec ligula quam, imperdiet
                  vel ante placerat
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
                <small>Cum sociis natoque penatibus et magnis dis parturient montes</small>
              </div>
            </a>
            <a class="list-group-item media" href="">
              <div class="pull-left">
                <img class="list-group__img img-circle" width="40" height="40"
                     src="/assets/img/demo/people/3.jpg" alt="">
              </div>
              <div class="media-body list-group__text">
                <strong>Jonathan Morris</strong>
                <small>Nunc quis diam diamurabitur at dolor elementum, dictum turpis vel</small>
              </div>
            </a>
            <a class="list-group-item media" href="">
              <div class="pull-left">
                <img class="list-group__img img-circle" width="40" height="40"
                     src="/assets/img/demo/people/4.jpg" alt="">
              </div>
              <div class="media-body list-group__text">
                <strong>Fredric Mitchell Jr.</strong>
                <small>Phasellus a ante et est ornare accumsan at vel magnauis blandit turpis at augue
                  ultricies
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
                <small>Ut vitae lacus sem ellentesque maximus, nunc sit amet varius dignissim, dui est
                  consectetur neque
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
                <small>Proin laoreet commodo eros id faucibus. Donec ligula quam, imperdiet vel ante
                  placerat
                </small>
              </div>
            </a>

            <a class="view-more" href="">View all</a>
          </div>
        </div>
      </li>
      <li class="hidden-xs">
        <a href=""><i class="zmdi zmdi-home"></i></a>
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

    <div class="header-alt__search-wrap">
      <form class="header-alt__search">
        <input type="text" placeholder="Search...">

        <i class="zmdi zmdi-long-arrow-left" data-rmd-action="block-close"
           data-rmd-target=".header-alt__search-wrap"></i>
      </form>
    </div>
  </header>
</template>