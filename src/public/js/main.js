'use strict';

/*------------------
    Comment realtime
--------------------*/

// var commentForm = document.getElementById('comment-form');
// var commentInput = document.getElementById('comment-new');
// var comments = document.getElementById('comments');

// socket.on('add comment', (comment) => {
//     var item = document.createElement('li');
//     item.textContent = comment;
//     comments.appendChild(item);
// })

(function ($) {
    /*------------------
            Preloader
        --------------------*/
    $(window).on('load', function () {
        $('.loader').fadeOut();
        $('#preloder').delay(200).fadeOut('slow');
    });

    /*------------------
            Background Set
        --------------------*/
    $('.set-bg').each(function () {
        var bg = $(this).data('setbg');
        $(this).css('background-image', 'url(' + bg + ')');
    });

    //Canvas Menu
    $('.canvas-open').on('click', function () {
        $('.offcanvas-menu-wrapper').addClass('show-offcanvas-menu-wrapper');
        $('.offcanvas-menu-overlay').addClass('active');
    });

    $('.canvas-close, .offcanvas-menu-overlay').on('click', function () {
        $('.offcanvas-menu-wrapper').removeClass('show-offcanvas-menu-wrapper');
        $('.offcanvas-menu-overlay').removeClass('active');
    });

    // Search model
    $('.search-switch').on('click', function () {
        $('.search-model').fadeIn(400);
    });

    $('.search-close-switch').on('click', function () {
        $('.search-model').fadeOut(400, function () {
            $('#search-input').val('');
        });
    });

    //Masonary
    // $('.gallery').masonry({
    //     itemSelector: '.gs-item',
    //     columnWidth: '.grid-sizer',
    //     gutter: 10,
    // });

    /*------------------
            Navigation
        --------------------*/
    // $('.mobile-menu').slicknav({
    //     prependTo: '#mobile-menu-wrap',
    //     allowParentLinks: true,
    // });

    /*------------------
            Carousel Slider
        --------------------*/
    var hero_s = $('.hs-slider');
    hero_s.owlCarousel({
        loop: true,
        margin: 0,
        nav: true,
        items: 1,
        dots: false,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        navText: [
            '<i class="fa fa-angle-left"></i>',
            '<i class="fa fa-angle-right"></i>',
        ],
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: false,
    });

    /*------------------
            Team Slider
        --------------------*/
    $('.ts-slider').owlCarousel({
        loop: true,
        margin: 0,
        items: 3,
        dots: true,
        dotsEach: 2,
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true,
        responsive: {
            320: {
                items: 1,
            },
            768: {
                items: 2,
            },
            992: {
                items: 3,
            },
        },
    });

    /*------------------
            Testimonial Slider
        --------------------*/
    $('.ts_slider').owlCarousel({
        loop: true,
        margin: 0,
        items: 1,
        dots: false,
        nav: true,
        navText: [
            '<i class="fa fa-angle-left"></i>',
            '<i class="fa fa-angle-right"></i>',
        ],
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true,
    });

    // $('#bar1').barfiller({
    //     barColor: '#ffffff',
    //     duration: 2000,
    // });
    // $('#bar2').barfiller({
    //     barColor: '#ffffff',
    //     duration: 2000,
    // });
    // $('#bar3').barfiller({
    //     barColor: '#ffffff',
    //     duration: 2000,
    // });

    $('.table-controls ul li').on('click', function () {
        var tsfilter = $(this).data('tsfilter');
        $('.table-controls ul li').removeClass('active');
        $(this).addClass('active');

        if (tsfilter == 'all') {
            $('.class-timetable').removeClass('filtering');
            $('.ts-meta').removeClass('show');
        } else {
            $('.class-timetable').addClass('filtering');
        }
        $('.ts-meta').each(function () {
            $(this).removeClass('show');
            if ($(this).data('tsmeta') == tsfilter) {
                $(this).addClass('show');
            }
        });
    });

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();

    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });

    // Sidebar Toggler
    $('.sidebar-toggler').click(function () {
        $('.sidebar, .content').toggleClass('open');
        return false;
    });

    // Progress Bar
    $('.pg-bar').waypoint(
        function () {
            $('.progress .progress-bar').each(function () {
                $(this).css('width', $(this).attr('aria-valuenow') + '%');
            });
        },
        { offset: '80%' },
    );

    $('.testimonial-carousel').owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        items: 1,
        dots: true,
        loop: true,
        nav: false,
    });
    var xValues = document.getElementById('class_name');
    var yValues = document.getElementById('so_luong_dk');
    if (xValues != null && yValues != null) {
        xValues = xValues.value.split(',');
        yValues = yValues.value.split(',');
        // class_prominent
        new Chart('myChart', {
            type: 'pie',
            data: {
                labels: xValues,
                datasets: [
                    {
                        backgroundColor: [
                            'rgba(251,91,33, .9)',
                            'rgba(251,91,33, .8)',
                            'rgba(251,91,33, .7)',
                            'rgba(251,91,33, .6)',
                            'rgba(251,91,33, .5)',
                        ],
                        data: yValues,
                    },
                ],
            },
            options: {
                title: {
                    display: true,
                    text: 'Buổi học được học viên tham gia nhiều nhất',
                },
            },
        });
    }

    const ctx2 = document.getElementById('char_join_date');
    var xValues1 = document.getElementById('join_date');
    var yValues1 = document.getElementById('sl_theongay');
    if (
        xValues1 != null &&
        yValues1 != null &&
        sl_theongay != null &&
        ctx2 != null
    ) {
        ctx2 = ctx2.getContext('2d');
        xValues1 = xValues1.value.split(',');
        yValues1 = yValues1.value.split(',');

        var myChart3 = new Chart(ctx2, {
            type: 'line',
            data: {
                labels: xValues1,
                datasets: [
                    {
                        label: 'Số người tham gia',
                        fill: false,
                        backgroundColor: 'rgba(0, 156, 255, .3)',
                        data: yValues1,
                    },
                ],
            },
            options: {
                responsive: true,
            },
        });
    }
    'function' != typeof Object.create &&
        (Object.create = function (t) {
            function o() {}
            return (o.prototype = t), new o();
        }),
        (function (t, o) {
            'use strict';
            var i = {
                _positionClasses: [
                    'bottom-left',
                    'bottom-right',
                    'top-right',
                    'top-left',
                    'bottom-center',
                    'top-center',
                    'mid-center',
                ],
                _defaultIcons: ['success', 'error', 'info', 'warning'],
                init: function (o) {
                    this.prepareOptions(o, t.toast.options), this.process();
                },
                prepareOptions: function (o, i) {
                    var s = {};
                    'string' == typeof o || o instanceof Array
                        ? (s.text = o)
                        : (s = o),
                        (this.options = t.extend({}, i, s));
                },
                process: function () {
                    this.setup(),
                        this.addToDom(),
                        this.position(),
                        this.bindToast(),
                        this.animate();
                },
                setup: function () {
                    var o = '';
                    if (
                        ((this._toastEl =
                            this._toastEl ||
                            t('<div></div>', { class: 'jq-toast-single' })),
                        (o += '<span class="jq-toast-loader"></span>'),
                        this.options.allowToastClose &&
                            (o +=
                                '<span class="close-jq-toast-single">&times;</span>'),
                        this.options.text instanceof Array)
                    ) {
                        this.options.heading &&
                            (o +=
                                '<h2 class="jq-toast-heading">' +
                                this.options.heading +
                                '</h2>'),
                            (o += '<ul class="jq-toast-ul">');
                        for (var i = 0; i < this.options.text.length; i++)
                            o +=
                                '<li class="jq-toast-li" id="jq-toast-item-' +
                                i +
                                '">' +
                                this.options.text[i] +
                                '</li>';
                        o += '</ul>';
                    } else
                        this.options.heading &&
                            (o +=
                                '<h2 class="jq-toast-heading">' +
                                this.options.heading +
                                '</h2>'),
                            (o += this.options.text);
                    this._toastEl.html(o),
                        this.options.bgColor !== !1 &&
                            this._toastEl.css(
                                'background-color',
                                this.options.bgColor,
                            ),
                        this.options.textColor !== !1 &&
                            this._toastEl.css('color', this.options.textColor),
                        this.options.textAlign &&
                            this._toastEl.css(
                                'text-align',
                                this.options.textAlign,
                            ),
                        this.options.icon !== !1 &&
                            (this._toastEl.addClass('jq-has-icon'),
                            -1 !==
                                t.inArray(
                                    this.options.icon,
                                    this._defaultIcons,
                                ) &&
                                this._toastEl.addClass(
                                    'jq-icon-' + this.options.icon,
                                ));
                },
                position: function () {
                    'string' == typeof this.options.position &&
                    -1 !==
                        t.inArray(this.options.position, this._positionClasses)
                        ? 'bottom-center' === this.options.position
                            ? this._container.css({
                                  left:
                                      t(o).outerWidth() / 2 -
                                      this._container.outerWidth() / 2,
                                  bottom: 20,
                              })
                            : 'top-center' === this.options.position
                            ? this._container.css({
                                  left:
                                      t(o).outerWidth() / 2 -
                                      this._container.outerWidth() / 2,
                                  top: 20,
                              })
                            : 'mid-center' === this.options.position
                            ? this._container.css({
                                  left:
                                      t(o).outerWidth() / 2 -
                                      this._container.outerWidth() / 2,
                                  top:
                                      t(o).outerHeight() / 2 -
                                      this._container.outerHeight() / 2,
                              })
                            : this._container.addClass(this.options.position)
                        : 'object' == typeof this.options.position
                        ? this._container.css({
                              top: this.options.position.top
                                  ? this.options.position.top
                                  : 'auto',
                              bottom: this.options.position.bottom
                                  ? this.options.position.bottom
                                  : 'auto',
                              left: this.options.position.left
                                  ? this.options.position.left
                                  : 'auto',
                              right: this.options.position.right
                                  ? this.options.position.right
                                  : 'auto',
                          })
                        : this._container.addClass('bottom-left');
                },
                bindToast: function () {
                    var t = this;
                    this._toastEl.on('afterShown', function () {
                        t.processLoader();
                    }),
                        this._toastEl
                            .find('.close-jq-toast-single')
                            .on('click', function (o) {
                                o.preventDefault(),
                                    'fade' === t.options.showHideTransition
                                        ? (t._toastEl.trigger('beforeHide'),
                                          t._toastEl.fadeOut(function () {
                                              t._toastEl.trigger('afterHidden');
                                          }))
                                        : 'slide' ===
                                          t.options.showHideTransition
                                        ? (t._toastEl.trigger('beforeHide'),
                                          t._toastEl.slideUp(function () {
                                              t._toastEl.trigger('afterHidden');
                                          }))
                                        : (t._toastEl.trigger('beforeHide'),
                                          t._toastEl.hide(function () {
                                              t._toastEl.trigger('afterHidden');
                                          }));
                            }),
                        'function' == typeof this.options.beforeShow &&
                            this._toastEl.on('beforeShow', function () {
                                t.options.beforeShow();
                            }),
                        'function' == typeof this.options.afterShown &&
                            this._toastEl.on('afterShown', function () {
                                t.options.afterShown();
                            }),
                        'function' == typeof this.options.beforeHide &&
                            this._toastEl.on('beforeHide', function () {
                                t.options.beforeHide();
                            }),
                        'function' == typeof this.options.afterHidden &&
                            this._toastEl.on('afterHidden', function () {
                                t.options.afterHidden();
                            });
                },
                addToDom: function () {
                    var o = t('.jq-toast-wrap');
                    if (
                        (0 === o.length
                            ? ((o = t('<div></div>', {
                                  class: 'jq-toast-wrap',
                              })),
                              t('body').append(o))
                            : (!this.options.stack ||
                                  isNaN(parseInt(this.options.stack, 10))) &&
                              o.empty(),
                        o.find('.jq-toast-single:hidden').remove(),
                        o.append(this._toastEl),
                        this.options.stack &&
                            !isNaN(parseInt(this.options.stack), 10))
                    ) {
                        var i = o.find('.jq-toast-single').length,
                            s = i - this.options.stack;
                        s > 0 &&
                            t('.jq-toast-wrap')
                                .find('.jq-toast-single')
                                .slice(0, s)
                                .remove();
                    }
                    this._container = o;
                },
                canAutoHide: function () {
                    return (
                        this.options.hideAfter !== !1 &&
                        !isNaN(parseInt(this.options.hideAfter, 10))
                    );
                },
                processLoader: function () {
                    if (!this.canAutoHide() || this.options.loader === !1)
                        return !1;
                    var t = this._toastEl.find('.jq-toast-loader'),
                        o = (this.options.hideAfter - 400) / 1e3 + 's',
                        i = this.options.loaderBg,
                        s = t.attr('style') || '';
                    (s = s.substring(0, s.indexOf('-webkit-transition'))),
                        (s +=
                            '-webkit-transition: width ' +
                            o +
                            ' ease-in;                       -o-transition: width ' +
                            o +
                            ' ease-in;                       transition: width ' +
                            o +
                            ' ease-in;                       background-color: ' +
                            i +
                            ';'),
                        t.attr('style', s).addClass('jq-toast-loaded');
                },
                animate: function () {
                    var t = this;
                    if (
                        (this._toastEl.hide(),
                        this._toastEl.trigger('beforeShow'),
                        'fade' === this.options.showHideTransition.toLowerCase()
                            ? this._toastEl.fadeIn(function () {
                                  t._toastEl.trigger('afterShown');
                              })
                            : 'slide' ===
                              this.options.showHideTransition.toLowerCase()
                            ? this._toastEl.slideDown(function () {
                                  t._toastEl.trigger('afterShown');
                              })
                            : this._toastEl.show(function () {
                                  t._toastEl.trigger('afterShown');
                              }),
                        this.canAutoHide())
                    ) {
                        var t = this;
                        o.setTimeout(function () {
                            'fade' ===
                            t.options.showHideTransition.toLowerCase()
                                ? (t._toastEl.trigger('beforeHide'),
                                  t._toastEl.fadeOut(function () {
                                      t._toastEl.trigger('afterHidden');
                                  }))
                                : 'slide' ===
                                  t.options.showHideTransition.toLowerCase()
                                ? (t._toastEl.trigger('beforeHide'),
                                  t._toastEl.slideUp(function () {
                                      t._toastEl.trigger('afterHidden');
                                  }))
                                : (t._toastEl.trigger('beforeHide'),
                                  t._toastEl.hide(function () {
                                      t._toastEl.trigger('afterHidden');
                                  }));
                        }, this.options.hideAfter);
                    }
                },
                reset: function (o) {
                    'all' === o
                        ? t('.jq-toast-wrap').remove()
                        : this._toastEl.remove();
                },
                update: function (t) {
                    this.prepareOptions(t, this.options),
                        this.setup(),
                        this.bindToast();
                },
            };
            (t.toast = function (t) {
                var o = Object.create(i);
                return (
                    o.init(t, this),
                    {
                        reset: function (t) {
                            o.reset(t);
                        },
                        update: function (t) {
                            o.update(t);
                        },
                    }
                );
            }),
                (t.toast.options = {
                    text: '',
                    heading: '',
                    showHideTransition: 'fade',
                    allowToastClose: !0,
                    hideAfter: 3e3,
                    loader: !0,
                    loaderBg: '#9EC600',
                    stack: 5,
                    position: 'bottom-left',
                    bgColor: !1,
                    textColor: !1,
                    textAlign: 'left',
                    icon: !1,
                    beforeShow: function () {},
                    afterShown: function () {},
                    beforeHide: function () {},
                    afterHidden: function () {},
                });
        })(jQuery, window, document);

    var error_login = document.getElementById('error_login');
    if (error_login) {
        error_login.onload = function () {
            err_login();
        };
    }

    var err_pass = document.getElementById('error_pass');
    if (err_pass) {
        err_pass.onload = function () {
            error_pass();
        };
    }
    function error_pass() {
        $.toast({
            heading: 'Mật khẩu sai',
            text: 'Nhập lại mật khẩu',
            icon: 'error',
            loader: true,
            loaderBg: '#fff',
            showHideTransition: 'plain',
            hideAfter: 3000,
            position: {
                left: 100,
                top: 30,
            },
        });
    }
    var err_mail = document.getElementById('mail_false');
    if (err_mail) {
        err_mail.onload = function () {
            mail_false();
        };
    }
    function mail_false() {
        $.toast({
            heading: 'Xác thực email thất bại',
            text: 'Hãy đăng ký lại',
            icon: 'error',
            loader: true,
            loaderBg: '#fff',
            showHideTransition: 'plain',
            hideAfter: 3000,
            position: {
                left: 100,
                top: 30,
            },
        });
    }

    var success = document.getElementById('success');
    var success_heading = document.getElementById('success_heading');
    var success_text = document.getElementById('success_text');
    if (success != null && success_heading != null && success_text != null) {
        success.onload = function () {
            success_function();
        };
        success_heading = success_heading.value;
        success_text = success_text.value;
    }
    function success_function() {
        $.toast({
            heading: success_heading,
            text: success_text,
            icon: 'success',
            loader: true,
            loaderBg: '#fff',
            showHideTransition: 'fade',
            hideAfter: 3000,
            allowToastClose: false,
            position: {
                left: 100,
                top: 30,
            },
        });
    }
    var error = document.getElementById('error');
    var error_heading = document.getElementById('error_heading');
    var error_text = document.getElementById('error_text');
    if (error != null && error_heading != null && error_text != null) {
        error.onload = function () {
            err();
        };
        error_heading = error_heading.value;
        error_text = error_text.value;
    }
    function err() {
        $.toast({
            heading: error_heading,
            text: error_text,
            icon: 'error',
            loader: true,
            loaderBg: '#fff',
            showHideTransition: 'plain',
            hideAfter: 3000,
            position: {
                left: 100,
                top: 30,
            },
        });
    }
    const passField = document.getElementById('password');
    const showBtn = document.getElementById('pass_eye');
    if (passField != null && showBtn != null) {
        showBtn.onclick = () => {
            if (passField.type === 'password') {
                passField.type = 'text';
                showBtn.classList.add('hide-btn');
            } else {
                passField.type = 'password';
                showBtn.classList.remove('hide-btn');
            }
        };
    }
})(jQuery);
