<script>
  import Headerblock from './partials/Header.vue'

  export default {
    components: {
      Headerblock,
    }
  }
</script>

<template>
  <div>
    <headerblock></headerblock>
    <section class="section">
    <div class="container">
        <header class="section__title text-left clearfix">
            <h2>Web marketing and distribution</h2>
            <small>Web</small>
            <!--<div class="actions actions&#45;&#45;section">-->
            <!--<div class="actions__toggle">-->
            <!--<input type="checkbox">-->
            <!--<i class="zmdi zmdi-favorite-outline"></i>-->
            <!--<i class="zmdi zmdi-favorite"></i>-->
            <!--</div>-->

            <!--<div class="dropdown">-->
            <!--<a href="" data-toggle="dropdown"><i class="zmdi zmdi-share"></i></a>-->

            <!--<div class="dropdown-menu pull-right rmd-share">-->
            <!--<div></div>-->
            <!--</div>-->
            <!--</div>-->
            <!--</div>-->
        </header>

        <div class="row">
            <div class="col-md-12">
                <div class="card profile">
                    <div class="profile__img">
                        <img src="https://freeiconshop.com/wp-content/uploads/edd/person-outline-filled.png" alt="">
                    </div>

                    <div class="profile__info">
                        <strong><a href="#">Evgeniy Myller</a></strong>
                        <div class="profile__review">
                            <span class="rmd-rate" data-rate-value="3" data-rate-readonly="true"></span>
                            <span>(263 Review)</span>
                        </div>
                        <ul class="rmd-contact-list">
                            <li><i class="zmdi zmdi-skype"></i>Skeper_200</li>
                            <li><i class="zmdi zmdi-phone"></i>308-360-8938</li>
                            <li><i class="zmdi zmdi-email"></i>malinda@inbound.plus</li>
                        </ul>
                    </div>
                </div>

                <div class="card">
                    <div class="tab-nav tab-nav--justified" data-rmd-breakpoint="500">
                        <div class="tab-nav__inner">
                            <ul>
                                <li class="active"><a href="contract-c.html">Task description</a></li>
                                <li><a href="contract-suggestions-c.html">Suggestions</a></li>
                                <!--<li><a href="agent-detail-reviews.html">Reviews</a></li>-->
                            </ul>
                        </div>
                    </div>

                    <div class="card__body">
                        <div class="card__sub row rmd-stats">
                            <div class="col-xs-4">
                                <div class="rmd-stats__item mdc-bg-teal-400">
                                    <h2>Today</h2>
                                    <small>Started</small>
                                </div>
                            </div>
                            <div class="col-xs-4">
                                <div class="rmd-stats__item mdc-bg-purple-400">
                                    <h2>November, 20</h2>
                                    <small>Finish</small>
                                </div>
                            </div>
                            <div class="col-xs-4">
                                <div class="rmd-stats__item mdc-bg-red-400">
                                    <h2>1000 CLN</h2>
                                    <small>Price</small>
                                </div>
                            </div>
                        </div>

                        <div class="card__sub clearfix">
                            <h4>Web marketing and distribution</h4>
                            <p data-editable-target="text-1">We are a small independent company looking for motivated
                                individuals, who are willing to help us with our short-term project. The project is
                                marketing related. If you co-operate with us, you will help us distribute our software
                                products worldwide. The job is not committed with extra working hours or binding with
                                additional obligations (about 2-3 hours per month).</p>
                            <button editable="text-1" class="btn-save btn-sm btn-primary">Editing</button>
                            <p data-editable-target="text-2">Specific skills are not required. All you need is a
                                personal computer or a laptop with active Internet connection and someone from our team
                                will guide you through the process. Is this an ongoing job? Yes, if you are committed.
                                The project has full potential to become long term one, but without adding extra
                                obligations.</p>
                            <button editable="text-2" class="btn-save btn-sm btn-primary">Editing</button>
                        </div>

                        <div class="card__sub">
                            <h4>Specialties</h4>
                            <p data-editable-target="text-3">Customer Support, Word Processing, Blogging, Language
                                Training</p>
                            <button editable="text-3" class="btn-save btn-sm btn-primary">Editing</button>
                        </div>

                        <div class="card__sub">
                            <h4>Steps of project</h4>
                            <div class="card-steps">
                                <ul>
                                    <li>
                                        <div class="list-group list-group--block tasks-lists">
                                            <div class="list-group-item">
                                                <div class="checkbox checkbox--char">
                                                    <label>
                                                        <input type="checkbox">
                                                        <span class="checkbox__helper"></span><span
                                                            data-editable-target="text-4" class="tasks-list__info">Technical Support<span
                                                            class="price-project">200 CLN</span>
                                            </span>
                                                    </label>
                                                </div>

                                                <div class="actions list-group__actions">
                                                    <div class="dropdown">
                                                        <a href="" data-toggle="dropdown"><i
                                                                class="zmdi zmdi-more-vert"></i></a>

                                                        <ul class="dropdown-menu pull-right">
                                                            <li><a href="">Mark as done</a></li>
                                                            <li><a href="">Deposit</a></li>
                                                            <li><a editable="text-4" class="prevent-default" href="#">Edit</a>
                                                            </li>
                                                            <li><a href="" data-demo-action="delete-listing">Delete</a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="list-group list-group--block tasks-lists">
                                            <div class="checked-icon" title="Ldfnnfffnf">
                                                <img src="img/icons/checked.png" alt="">
                                            </div>
                                            <div class="list-group-item">
                                                <div class="checkbox checkbox--char">
                                                    <label>
                                                        <input type="checkbox">
                                                        <span class="checkbox__helper"></span><span
                                                            data-editable-target="text-5" class="tasks-list__info">Controller and Administration<span
                                                            class="price-project">300 CLN</span>
                                            </span>
                                                    </label>
                                                </div>

                                                <div class="actions list-group__actions">
                                                    <div class="dropdown">
                                                        <a href="" data-toggle="dropdown"><i
                                                                class="zmdi zmdi-more-vert"></i></a>

                                                        <ul class="dropdown-menu pull-right">
                                                            <li><a href="">Mark as done</a></li>
                                                            <li><a href="">Deposit</a></li>
                                                            <li><a editable="text-5" class="prevent-default" href="">Edit</a>
                                                            </li>
                                                            <li><a href="" data-demo-action="delete-listing">Delete</a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="list-group list-group--block tasks-lists">
                                            <div class="list-group-item">
                                                <div class="checkbox checkbox--char">
                                                    <label>
                                                        <input type="checkbox">
                                                        <span class="checkbox__helper"></span><span
                                                            data-editable-target="text-6" class="tasks-list__info">Marketing Communications<span
                                                            class="price-project">200 CLN</span>
                                            </span>
                                                    </label>
                                                </div>

                                                <div class="actions list-group__actions">
                                                    <div class="dropdown">
                                                        <a href="" data-toggle="dropdown"><i
                                                                class="zmdi zmdi-more-vert"></i></a>

                                                        <ul class="dropdown-menu pull-right">
                                                            <li><a href="">Mark as done</a></li>
                                                            <li><a href="">Deposit</a></li>
                                                            <li><a editable="text-6" class="prevent-default" href="">Edit</a>
                                                            </li>
                                                            <li><a href="" data-demo-action="delete-listing">Delete</a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="list-group list-group--block tasks-lists">
                                            <div class="list-group-item">
                                                <div class="checkbox checkbox--char">
                                                    <label>
                                                        <input type="checkbox">
                                                        <span class="checkbox__helper"></span><span
                                                            data-editable-target="text-7" class="tasks-list__info">Product Management<span
                                                            class="price-project">300 CLN</span>
                                            </span>
                                                    </label>
                                                </div>

                                                <div class="actions list-group__actions">
                                                    <div class="dropdown">
                                                        <a href="" data-toggle="dropdown"><i
                                                                class="zmdi zmdi-more-vert"></i></a>
                                                        <ul class="dropdown-menu pull-right">
                                                            <li><a href="">Mark as done</a></li>
                                                            <li><a href="">Deposit</a></li>
                                                            <li><a href="">Edit</a></li>
                                                            <li><a href="" data-demo-action="delete-listing">Delete</a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <!--<div class="card__sub">-->
                        <!--<h4>Contact Information</h4>-->

                        <!--<ul class="rmd-contact-list">-->
                        <!--<li><i class="zmdi zmdi-phone"></i>308-360-8938</li>-->
                        <!--<li><i class="zmdi zmdi-email"></i>robertbosborne@inbound.plus</li>-->
                        <!--<li><i class="zmdi zmdi-facebook"></i>robertbosborne</li>-->
                        <!--<li><i class="zmdi zmdi-twitter"></i>@robertbosborne</li>-->
                        <!--<li><i class="zmdi zmdi-pin"></i>5470 Madison Street Severna Park, MD 21146</li>-->
                        <!--</ul>-->
                        <!--</div>-->
                    </div>
                </div>
            </div>
        </div>
    </div>
    </section>
  </div>
</template>