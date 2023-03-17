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
    // var xValues = ["Italy", "France", "Spain", "USA", "Argentina"];
    var xValues = document.getElementById('class_name').value.split(',');
    var yValues = document.getElementById('so_luong_dk').value.split(',');
    // var yValues = [ 4, 3, 2, 1, 1 ];

    console.log(xValues);
    console.log(yValues);
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
    // getData()
    // async function getData() {
    //    const response
    // }
})(jQuery);
