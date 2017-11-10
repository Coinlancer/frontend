import sjcl from 'sjcl';

const Helpers = {
    install (Vue, options) {
        Vue.helpers = Vue.prototype.$helpers = {

            decryptKeypair: function (/*base64*/ crypto_pair, password) {
                try {
                    crypto_pair = atob(crypto_pair);
                    var decryptedData = sjcl.json.decrypt(password, crypto_pair);
                    let keypair = JSON.parse(decryptedData);
                    keypair.privateKey = new Buffer(keypair.privateKey);
                    keypair.salt = new Buffer(keypair.salt);
                    keypair.iv = new Buffer(keypair.iv);

                    return keypair;
                } catch (err) {
                    console.error(err);

                    return false;
                }
            },

            encryptKeypair: function (crypto_pair, password) {
                var encryptedData = sjcl.json.encrypt(password, JSON.stringify(crypto_pair));

                return btoa(encryptedData);
            },

            formatPhone: function (phone) {
                return Vue.prototype.$phoneformatter.format(phone, '+N (NNN) ' + Array(phone.length - 4 + 1).join("N"), {normalize: true});
            },

            externalPluginsExecute: function () {

                $(document).ready(function () {
                    if ($(".rmd-rate")[0]) {
                        $(".rmd-rate").each(function () {
                            var rate = $(this).data("rate-value"), readOnly = $(this).data("rate-readonly");
                            $(this).rateYo({
                                rating: rate,
                                fullStar: !0,
                                starWidth: "18px",
                                ratedFill: "#fcd461",
                                normalFill: "#eee",
                                readOnly: readOnly || "false"
                            })
                        })
                    }
                });

                $(document).ready(function () {
                    $("body").on("click", "[data-rmd-action]", function (e) {
                        e.preventDefault();
                        var action = $(this).data("rmd-action");
                        $(this);
                        switch (action) {
                            case"block-open":
                                var rmdTarget = $(this).data("rmd-target"), rmdBackdrop = $(this).data("rmd-backdrop-class") || "";
                                $(rmdTarget).addClass("toggled"), $("body").addClass("block-opened").append('<div data-rmd-action="block-close" data-rmd-target=' + rmdTarget + ' class="rmd-backdrop rmd-backdrop--dark ' + rmdBackdrop + '" />'), $(".rmd-backdrop").fadeIn(300);
                                break;
                            case"block-close":
                                var rmdTarget = $(this).data("rmd-target");
                                $(rmdTarget).removeClass("toggled"), $("body").removeClass("block-opened"), $(".rmd-backdrop").fadeOut(300), setTimeout(function () {
                                    $(".rmd-backdrop").remove()
                                }, 300);
                                break;
                            case"navigation-close":
                                $(".navigation").removeClass("toggled"), $("body").removeClass("block-opened"), $(".rmd-backdrop").fadeOut(300), setTimeout(function () {
                                    $(".rmd-backdrop").remove()
                                }, 300);
                            case"advanced-search-open":
                                $(this).closest(".search__body").addClass("toggled"), $(".h-backdrop")[0] || $("#header").append('<div data-rmd-action="advanced-search-close" class="rmd-backdrop search-backdrop" />');
                                break;
                            case"advanced-search-close":
                                var ascParent = $(".search__body");
                                $(".search-backdrop").remove(), ascParent.addClass("closed"), setTimeout(function () {
                                    ascParent.removeClass("toggled closed")
                                }, 270);
                                break;
                            case"print":
                                window.print();
                                break;
                            case"inner-search-open":
                                $("body").addClass("block-opened").append('<div data-rmd-action="inner-search-close" class="rmd-backdrop--dark rmd-backdrop" />'), $("#inner-search").addClass("toggled"), $(".rmd-backdrop").fadeIn(300);
                                break;
                            case"inner-search-close":
                                $(".rmd-backdrop").fadeOut(300), $("body").removeClass("block-opened"), $("#inner-search").removeClass("toggled"), setTimeout(function () {
                                    $(".rmd-backdrop").remove()
                                }, 300);
                                break;
                            case"switch-login":
                                $(this).parent().find(".tab-pane").removeClass("active in"), $("#top-nav-login").addClass("active in");
                                break;
                            case"scroll-to":
                                var scrollToTarget = $(this).data("rmd-target"), scrollToOffset = $(this).data("rmd-offset") || 0;
                                $("html, body").animate({scrollTop: $(scrollToTarget).offset().top - scrollToOffset}, 500);
                                break;
                            case"blog-comment-open":
                                var bcoParent = $(this).closest(".list-group__text"), bcoContent = '<form class="blog-comment__reply animated fadeIn"><textarea placeholder="Write something..." class="textarea-autoheight"></textarea><div class="text-center"><button class="btn btn-xs btn-link" data-rmd-action="blog-comment-close">Post reply</button><button class="btn btn-xs btn-link" data-rmd-action="blog-comment-close">Dismiss</button></div></form>';
                                bcoParent.append(bcoContent), autosize($(".textarea-autoheight"));
                                break;
                            case"blog-comment-close":
                                var bccTarget = $(this).closest(".list-group__text").find(".blog-comment__reply");
                                bccTarget.addClass("fadeOut"), setTimeout(function () {
                                    bccTarget.remove()
                                }, 320)
                        }
                    })
                }), $(document).ready(function () {
                    function isMobile() {
                        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? !0 : void 0
                    }

                    if (isMobile() && $("html").addClass("ismobile"), $('[data-toggle="tooltip"]')[0] && $('[data-toggle="tooltip"]').tooltip(), $(".search__type")[0] && $('.search__type input[type="radio"]').on("change", function () {
                            var value = $(this).val(), parent = $(this).closest(".search__type");
                            parent.find("a[data-toggle]").text(value), parent.removeClass("open")
                        }), $("select.select2")[0] && $("select.select2").select2({
                            dropdownAutoWidth: !0,
                            width: "100%"
                        }), $(".header__recommended")[0] && $(".header__recommended .listings-grid").slick({
                            speed: 300,
                            slidesToShow: 4,
                            slidesToScroll: 1,
                            dotsClass: "slick-dots slick-dots-light",
                            infinite: !0,
                            responsive: [{breakpoint: 1200, settings: {slidesToShow: 3, slidesToScroll: 3}}, {
                                breakpoint: 960,
                                settings: {slidesToShow: 2, slidesToScroll: 2}
                            }, {
                                breakpoint: 700,
                                settings: {slidesToShow: 2, slidesToScroll: 2, dots: !0, arrows: !1}
                            }, {breakpoint: 550, settings: {slidesToShow: 1, slidesToScroll: 1, dots: !0, arrows: !1}}]
                        }), $(".grid-widget--listings")[0] && $(".grid-widget--listings").slick({
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            mobileFirst: !0,
                            dots: !0,
                            arrows: !1,
                            dotsClass: "slick-dots slick-dots-light",
                            responsive: [{breakpoint: 480, settings: "unslick"}]
                        }), $("body").on("click", ".stop-propagate", function (e) {
                            e.stopPropagation()
                        }), $("body").on("click", ".prevent-default", function (e) {
                            e.preventDefault()
                        }), $(".form-group--float")[0] && ($(".form-group--float").each(function () {
                            var p = $(this).find(".form-control").val();
                            0 == !p.length && $(this).addClass("form-group--active")
                        }), $("body").on("blur", ".form-group--float .form-control", function () {
                            var i = $(this).val(), p = $(this).parent();
                            0 == i.length ? p.removeClass("form-group--active") : p.addClass("form-group--active")
                        })), $(".light-gallery")[0] && $(".light-gallery").lightGallery(), $(".textarea-autoheight")[0] && autosize($(".textarea-autoheight")), $(".rmd-share")[0] && $(".rmd-share > div").jsSocials({
                            shares: [{
                                share: "facebook",
                                label: "",
                                logo: "zmdi zmdi-facebook",
                                shareIn: "blank",
                                css: "rmds-item mdc-bg-indigo-400 animated bounceIn"
                            }, {
                                share: "twitter",
                                label: "",
                                logo: "zmdi zmdi-twitter",
                                shareIn: "blank",
                                css: "rmds-item mdc-bg-cyan-500 animated bounceIn"
                            }, {
                                share: "googleplus",
                                label: "",
                                logo: "zmdi zmdi-google",
                                shareIn: "blank",
                                css: "rmds-item mdc-bg-red-400 animated bounceIn"
                            }, {
                                share: "linkedin",
                                label: "",
                                logo: "zmdi zmdi-linkedin",
                                shareIn: "blank",
                                css: "rmds-item mdc-bg-blue-600 animated bounceIn"
                            }]
                        }), $(".action-header")[0] && $("#header, .action-header").affix({offset: {top: $(".action-header").offset().top}}), $("[data-rmd-breakpoint]")[0] && $("[data-rmd-breakpoint]").each(function () {
                            var breakPoint = $(this).data("rmd-breakpoint"), target = $(this), activeItem = $(this).find("ul li.active > a").text();
                            target.find(".tab-nav__inner").addClass("dropdown").prepend('<a class="tab-nav__toggle" data-toggle="dropdown">' + activeItem + "</a>"), $(window).resize(function () {
                                $(this).width() < breakPoint ? (target.addClass("tab-nav--mobile"), target.find("ul").addClass("dropdown-menu")) : (target.removeClass("tab-nav--mobile"), target.find(".tab-nav__inner").removeClass("dropdown"), target.find("ul").removeClass("dropdown-menu"))
                            }).resize()
                        }), !$("html").is(".ie9") && $(".notes__body")[0]) {
                        var clamp;
                        $(".notes__body").each(function (index, element) {
                            clamp = $(this).prev().is(".notes__title") ? 4 : 6, $clamp(element, {clamp: clamp})
                        })
                    }
                    $("html").is(".ie9") || $(".note-view__body")[0] && $(".note-view__body").trumbowyg({
                        autogrow: !0,
                        btns: ["btnGrp-semantic", ["formatting"], "btnGrp-justify", "btnGrp-lists", ["removeformat"]]
                    }), isMobile() || $(".navigation__dropdown")[0] && $(".navigation__dropdown").hover(function () {
                        $(this).find(".navigation__drop-menu").fadeIn(250)
                    }, function () {
                        $(this).find(".navigation__drop-menu").fadeOut(200)
                    }), $(".ie9")[0] && $("input, textarea").placeholder()
                });

                // 1. Price Range

                if ($('#property-price-range')[0]) {
                    var propertyPriceRange = document.getElementById('property-price-range');
                    var propertyPriceRangeValues = [
                        document.getElementById('property-price-upper'),
                        document.getElementById('property-price-lower')
                    ]

                    noUiSlider.create(propertyPriceRange, {
                        start: [12000, 70000],
                        connect: true,
                        range: {
                            'min': 12000,
                            'max': 70000
                        }
                    });

                    propertyPriceRange.noUiSlider.on('update', function (values, handle) {
                        propertyPriceRangeValues[handle].innerHTML = values[handle];
                    });
                }

// 2. Property Area Size

                if ($('#property-area-range')[0]) {
                    var propertyAreaRange = document.getElementById('property-area-range');
                    var propertyAreaRangeValues = [
                        document.getElementById('property-area-upper'),
                        document.getElementById('property-area-lower')
                    ]

                    noUiSlider.create(propertyAreaRange, {
                        start: [3500, 10000],
                        connect: true,
                        range: {
                            'min': 3500,
                            'max': 10000
                        }
                    });

                    propertyAreaRange.noUiSlider.on('update', function (values, handle) {
                        propertyAreaRangeValues[handle].innerHTML = values[handle];
                    });
                }

// 3. Lot Size

                if ($('#property-lot-range')[0]) {
                    var propertyLotRange = document.getElementById('property-lot-range');
                    var propertyLotRangeValues = [
                        document.getElementById('property-lot-upper'),
                        document.getElementById('property-lot-lower')
                    ]

                    noUiSlider.create(propertyLotRange, {
                        start: [1000, 5000],
                        connect: true,
                        range: {
                            'min': 1000,
                            'max': 5000
                        }
                    });

                    propertyLotRange.noUiSlider.on('update', function (values, handle) {
                        propertyLotRangeValues[handle].innerHTML = values[handle];
                    });
                }

// 3. Year Built

                if ($('#property-year-built')[0]) {
                    var propertyYbRange = document.getElementById('property-year-built');
                    var propertyYbRangeValues = [
                        document.getElementById('property-yb-upper'),
                        document.getElementById('property-yb-lower')
                    ]

                    noUiSlider.create(propertyYbRange, {
                        start: [1990, 2016],
                        connect: true,
                        range: {
                            'min': 1990,
                            'max': 2016
                        }
                    });

                    propertyYbRange.noUiSlider.on('update', function (values, handle) {
                        propertyYbRangeValues[handle].innerHTML = Math.round(values[handle]);
                    });
                }


                $(document).ready(function () {
                    /*-----------------------------------------------------
                     Submit property steps switch
                     - used in last form tab of 'submit-property.html'
                     ------------------------------------------------------*/
                    $('body').on('shown.bs.tab', '.submit-property__button', function () {
                        var currentTab = $(this).attr('href');

                        $('.submit-property__steps > li').removeClass('active');
                        $('.submit-property__steps > li > a[href=' + currentTab + ']').parent().addClass('active');
                    })


                    /*-----------------------------------------------------
                     Calendar and Calendar Widget
                     - Used in dashboard index and calendar pages
                     ------------------------------------------------------*/
                    if ($('#calendar-widget')[0]) {
                        $('.calendar-widget__body').fullCalendar({
                            contentHeight: 'auto',
                            theme: false,
                            header: {
                                right: 'next',
                                center: 'title, ',
                                left: 'prev'
                            },
                            buttonIcons: {
                                prev: 'left',
                                next: 'right',
                            },
                            defaultDate: '2016-08-12',
                            editable: true,
                            events: [
                                {
                                    title: 'Dolor Pellentesque',
                                    start: '2016-08-01',
                                    className: 'fc-event--cyan'
                                },
                                {
                                    title: 'Purus Nibh',
                                    start: '2016-08-07',
                                    className: 'fc-event--amber'
                                },
                                {
                                    title: 'Amet Condimentum',
                                    start: '2016-08-09',
                                    className: 'fc-event--green'
                                },
                                {
                                    title: 'Tellus',
                                    start: '2016-08-12',
                                    className: 'fc-event--blue'
                                },
                                {
                                    title: 'Vestibulum',
                                    start: '2016-08-18',
                                    className: 'fc-event--cyan'
                                },
                                {
                                    title: 'Ipsum',
                                    start: '2016-08-24',
                                    className: 'fc-event--teal'
                                },
                                {
                                    title: 'Fringilla Sit',
                                    start: '2016-08-27',
                                    className: 'fc-event--blue'
                                },
                                {
                                    title: 'Amet Pharetra',
                                    url: 'http://google.com/',
                                    start: '2016-08-30',
                                    className: 'mdc-bg-amber-500'
                                }
                            ]
                        });

                        //Display Current Date as Calendar widget header
                        var mYear = moment().format('YYYY');
                        var mDay = moment().format('dddd, MMM D');
                        $('.calendar-widget__year').html(mYear);
                        $('.calendar-widget__day').html(mDay);
                    }


                    /*-----------------------------------------------------
                     Demo list delete
                     - Used in dashboaed/listings.html
                     ------------------------------------------------------*/
                    if ($('[data-demo-action="delete-listing"]')[0]) {
                        $('[data-demo-action="delete-listing"]').click(function (e) {
                            e.preventDefault();

                            swal({
                                title: 'Are you sure?',
                                text: "You won't be able to revert this!",
                                type: 'warning',
                                showCancelButton: true,
                                confirmButtonColor: '#3085d6',
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Yes, delete it!'
                            }).then(function () {
                                swal(
                                    'Deleted!',
                                    'Your list has been deleted.',
                                    'success'
                                );
                            })
                        });
                    }


                    $.fn.editable = function (cb) {
                        $(this).each(function (e) {
                            let $note = $(this)
                            let targetName = $note.attr('editable')

                            let $target = $(`[data-editable-target=${targetName}]`)

                            let $input;

                            $note.click(onclick)

                            function onclick(e) {

                                // into input
                                $input = $(' <textarea class="form-control textarea-autoheight" style="overflow-x: hidden; word-wrap: break-word; overflow-y: visible; border-bottom: 1px solid #eee;"></textarea>\n' +
                                    '                         ');
                                $input.val($target.text())
                                $input.addClass('_editable')

                                $target.text('')
                                $target.append($input)

                                $input.focus()

                                // wait till blur
                                window.addEventListener('keypress', onenter)
                                $input.blur(onleave)

                                $note.off('click', onclick)
                            }

                            function onenter(e) {
                                if (e.keyCode === 13) {
                                    $input.blur()
                                }
                            }

                            function onleave(e) {
                                /**
                                 * element takes initial form back
                                 */
                                let val = $input.val()
                                $target.text(val)

                                if (typeof cb === 'function') {
                                    cb(val)
                                }

                                window.removeEventListener('keypress', onenter)

                                $note.click(onclick)
                            }

                        })
                    }

                    $('[editable]').editable(function (val) {
                    })

                });
                /*-----------------------------------------------------
                 Demo editing text
                 - Used in contacts
                 ------------------------------------------------------*/
            },

            errorMsg: function (msg) {
                return Vue.prototype.$notify({
                    type: 'error',
                    text: msg,
                    title: 'Error'
                })
            },

            successMsg: function (msg) {
                return Vue.prototype.$notify({
                    type: 'success',
                    text: msg,
                    title: 'Success'
                })
            },

            getCurrentRole: function (account) {

                let current_role = localStorage.getItem('current_role');

                switch (current_role) {
                    case 'freelancer':
                        if (!account.frl_id) {
                            current_role = null;
                        }
                        break;
                    case 'client':
                        if (!account.cln_id) {
                            current_role = null;
                        }
                        break;
                    default:
                        current_role = null;
                }

                if (!current_role) {
                    if (account.frl_id) {
                        current_role = 'freelancer';
                    } else {
                        current_role = 'client';
                    }
                }

                if (localStorage.getItem('current_role') != current_role) {
                    localStorage.setItem('current_role', current_role);
                }

                return current_role;
            }
        }
    }
}

export default Helpers;