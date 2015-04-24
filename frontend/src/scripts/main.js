$ = jQuery;
$(function () {

    var bodyEl = document.body,
        content = document.querySelector('.content-wrap'),
        openbtn = document.getElementById('open-button'),
        closebtn = document.getElementById('close-button'),
        isOpen = false;

    function init() {
        initEvents();
    }

    function initEvents() {
        if (openbtn) openbtn.addEventListener('click', toggleMenu);
        if (closebtn) closebtn.addEventListener('click', toggleMenu);

        // close the menu element if the target it´s not the menu element or one of its descendants..
        content.addEventListener('click', function (ev) {
            var target = ev.target;
            if (isOpen && target !== openbtn) toggleMenu();
        });
    }

    function toggleMenu() {
        if (isOpen) {
            classie.remove(bodyEl, 'show-menu');
            $('.menu-wrap').stop().slideUp(300);
        }
        else {
            classie.add(bodyEl, 'show-menu');
            $('.menu-wrap').slideDown(300);
        }
        isOpen = !isOpen;
    }

    init();

    $('.menu-side ul li.expanded').hover(function () {
        if ($(window).width() >= 960) {
            $(this).children('ul').stop().slideToggle();
            $(this).toggleClass('open');
        }
    });
    $('.menu-side ul li.expanded').click(function () {
        if ($(window).width() >= 960) {
            $(this).children('ul').stop().slideToggle();
            $(this).toggleClass('open');
        }
    });

    /* HEADER */

    (function () {

        var width, height, largeHeader, canvas, ctx, circles, target, animateHeader = true;

        // Main
        initHeader();
        addListeners();

        function initHeader() {
            width = window.innerWidth;
            height = window.innerHeight;
            target = {x: 0, y: height};

            largeHeader = document.getElementById('top');

            canvas = document.getElementById('demo-canvas');
            canvas.width = width;
            canvas.height = height;
            ctx = canvas.getContext('2d');

            // create particles
            circles = [];
            for(var x = 0; x < width*0.5; x++) {
                var c = new Circle();
                circles.push(c);
            }
            animate();
        }

        // Event handling
        function addListeners() {
            window.addEventListener('scroll', scrollCheck);
            window.addEventListener('resize', resize);
        }

        function scrollCheck() {
            if (document.body.scrollTop > height) animateHeader = false;
            else animateHeader = true;
        }

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        }

        function animate() {
            if (animateHeader) {
                ctx.clearRect(0,0,width,height);
                for(var i in circles) {
                    circles[i].draw();
                }
            }
            requestAnimationFrame(animate);
        }

        // Canvas manipulation
        function Circle() {
            var _this = this;

            // constructor
            (function () {
                _this.pos = {};
                init();
            })();

            function init() {
                _this.pos.x = Math.random()*width;
                _this.pos.y = height+Math.random()*100;
                _this.alpha = 0.1+Math.random()*0.3;
                _this.scale = 0.1+Math.random()*0.3;
                _this.velocity = Math.random();
            }

            this.draw = function () {
                if (_this.alpha <= 0) {
                    init();
                }
                _this.pos.y -= _this.velocity;
                _this.alpha -= 0.0005;
                ctx.beginPath();
                ctx.arc(_this.pos.x, _this.pos.y, _this.scale*10, 0, 2 * Math.PI, false);
                ctx.fillStyle = 'rgba(255,255,255,'+ _this.alpha+')';
                ctx.fill();
            };
        }

    })();
});