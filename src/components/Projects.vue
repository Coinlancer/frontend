<script>
  import { mapGetters } from 'vuex'
  import Headerblock from './partials/Header.vue'
  import Footerblock from './partials/Footer.vue'

  export default {
    data: function () {
      return {
        filters: {
          location: '',
          job_type: '',
          skills: [],
          range: {
            from: 0,
            to: 0
          }
        }
      }
    },
    computed: mapGetters({
      projects: 'allProjects',
      skills: 'allSkills'
    }),
    methods: {
      setFilters: function (e) {
        let vm = this;
        console.log(e);
      },
      getSkillNameById: function (id) {
        let vm = this;
        let skill = vm.skills.filter((skill) => {
          return skill.skl_id == id
        });
        if (skill.length) {
          return skill[0].skl_title;
        }
      }
    },
    created () {
      this.$store.dispatch('getAllProjects');
      this.$store.dispatch('getAllSkills');
    },
    components: {
      Headerblock,
      Footerblock
    }
  }
</script>

<template>
  <div>
    <headerblock></headerblock>

    <div class="action-header">
      <div class="container">
        <div class="action-header__item action-header__item--search">
          <form>
            <input class="hidden-xs" type="text" placeholder="Search by neighborhood, city, zip or address...">
            <!-- For desktop -->
            <input class="visible-xs" type="text" placeholder="Search..."><!-- For mobile -->
          </form>
        </div>

        <div class="action-header__item action-header__views hidden-xs">
          <a href="listings-grid.html" class="zmdi zmdi-apps"></a>
          <a href="listings-list.html" class="zmdi zmdi-view-list active"></a>
          <a href="listings-map.html" class="zmdi zmdi-map"></a>
        </div>

        <div class="action-header__item action-header__item--sort hidden-xs">
          <span class="action-header__small">Sort by :</span>

          <select class="select2">
            <option>Featured listings</option>
            <option>Newest to oldest</option>
            <option>Oldest to Newest</option>
            <option>Price hight to low</option>
            <option>Price low to high</option>
            <option>Newest to Oldest</option>
            <option>No. of photos</option>
          </select>
        </div>
      </div>
    </div>

    <section class="section">
      <div class="container">

        <div class="row">
          <div class="col-sm-4">
            <form class="card">
              <div class="card__header">
                <h2>Advanced Property Search</h2>
              </div>

              <div class="card__body m-t-20">
                <div class="form-group form-group--float">
                  <input type="text" class="form-control" value="New York, NY">
                  <label class="fg-float">Location</label>
                  <i class="form-group__bar"></i>
                </div>

                <div class="form-group">
                  <label>Job Type</label>
                  <div class="btn-group btn-group-justified" data-toggle="buttons">
                    <label class="btn active">
                      <input type="radio" name="advanced-search-beds" id="rent" checked="">Permanent job
                    </label>
                    <label class="btn">
                      <input type="radio" name="advanced-search-beds" id="buy">Single orders
                    </label>
                  </div>
                </div>

                <div class="form-group">
                  <label>Skills Required</label>

                  <select class="select2 select2-hidden-accessible" tabindex="-1" aria-hidden="true">
                    <option value="">1C:ENTERPRISE</option>
                    <option value="">360 VIEW</option>
                    <option value="">3D MODELING </option>
                    <option value="">3D RENDERING </option>
                    <option value="">ADOBE ANALYTICS</option>
                    <option value="">ANDROID STUDIO</option>
                    <option value="">ANGULARJS</option>
                    <option value="">ASP.NET</option>
                    <option value="">JAVA</option>
                    <option value="">JAVASCRIPT</option>
                    <option value="">PHP 5.X</option>
                    <option value="">POSTGRESQL</option>
                    <option value="">MYSQL</option>
                    <option value="">C++</option>
                    <option value="">PYTHON</option>
                  </select>
                </div>

                <div class="form-group form-group--range">
                  <label>Price Range</label>
                  <div class="input-slider-values clearfix">
                    <div class="pull-left"><span id="property-price-upper"></span><span> CLN</span></div>
                    <div class="pull-right"><span id="property-price-lower"></span></span><span> CLN</span></div>
                  </div>
                  <div id="property-price-range"></div>
                </div>

              </div>

              <div class="card__footer">
                <button class="btn btn-sm btn-primary">Search</button>
                <a href="" class="btn btn-link" data-rmd-action="block-close"
                   data-rmd-target="#advanced-search">Save</a>
                <a href="" class="btn btn-link" data-rmd-action="block-close"
                   data-rmd-target="#advanced-search">Cancel</a>
              </div>
            </form>
          </div>
          <div class="col-sm-8 listings-list">
            <div class="listings-grid__item" v-for="project in projects">
              <router-link :to="'/project/' + project.prj_id" class="media">
                <div class="media-body">
                  <div class="listings-grid__body">
                    <small>{{project.prj_title}}</small>
                    <p>
                      <span v-if="project.prj_budget">
                        Fixed-Price - <b>{{project.prj_budget}} CLN</b>
                        - Est. Budget: $100 -
                      </span>
                       Posted <timeago :since="new Date(project.prj_created_at * 1000).toString()"></timeago></p>
                    <h5>{{project.prj_description}}</h5>
                  </div>

                  <ul v-if="project.prj_skill_ids.length" class="listings-grid__attrs">
                    <li>Skills:</li>

                    <li v-for="skill_id in project.prj_skill_ids">
                      <span class="label label-success">{{getSkillNameById(skill_id)}}</span>
                    </li>
                  </ul>
                </div>
              </router-link>

              <div class="actions listings-grid__favorite">
                <div class="actions__toggle">
                  <input type="checkbox">
                  <i class="zmdi zmdi-favorite-outline"></i>
                  <i class="zmdi zmdi-favorite"></i>
                </div>
              </div>
            </div>

            <!--<nav class="text-center">-->
              <!--<ul class="pagination">-->
                <!--<li>-->
                  <!--<a href="#" aria-label="Previous">-->
                    <!--<i class="zmdi zmdi-chevron-left"></i>-->
                  <!--</a>-->
                <!--</li>-->
                <!--<li class="active"><a href="#">1</a></li>-->
                <!--<li><a href="#">2</a></li>-->
                <!--<li><a href="#">3</a></li>-->
                <!--<li><a href="#">4</a></li>-->
                <!--<li><a href="#">5</a></li>-->
                <!--<li>-->
                  <!--<a href="#" aria-label="Next">-->
                    <!--<i class="zmdi zmdi-chevron-right"></i>-->
                  <!--</a>-->
                <!--</li>-->
              <!--</ul>-->
            <!--</nav>-->
          </div>
        </div>
      </div>
    </section>

    <footerblock></footerblock>
  </div>
</template>

<style>
  @import '../assets/css/my_custom.css';
</style>